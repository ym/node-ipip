'use strict';


var fs = require('fs'),
  dns = require('dns'),
  net = require('net');


var DEFAULT_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.dat');


/**
 * IPIP database reader
 * @param {Object|String} opt initialize options
 */
function IPIP(opt) {
  if (typeof opt === 'string') {
    this._database = opt;
    this._version = opt.split('.').pop();
  } else {
    opt = opt || {};
    this._database = opt.data || DEFAULT_DATA_PATH;
    this._version = opt.version || this._database.split('.').pop();
  }

  if (!this._version.match(/^datx?$/i)) {
    throw new Error('Invalid database version');
  }

  var Driver = require('./' + this._version);
  // note: it blocks the application
  var buffer = fs.readFileSync(this._database);
  this._driver = new Driver(buffer);
}

/**
 * query information by ip address
 * @param  {String} ip IPv4 address
 * @return {Object|Array}    query result
 */
IPIP.prototype.ip = function(ip, format) {
  var ipInt = 0;
  if (typeof ip === 'number') {
    ipInt = ip;
  } else if (net.isIPv4(ip)) {
    ipInt = ip.split('.')
      .reverse()
      .map(function(v, i) {
        return v << (8 * i);
      })
      .reduce(function(a, b) {
        return a + b;
      }) >>> 0;
  }

  if (isNaN(ipInt) || ipInt <= 0 || ipInt > 0xFFFFFFFF) {
    throw new Error('Invalid ip address: ' + ip);
  }

  var result = this._driver.lookup(ipInt);
  return this._wrap(result, format);
};

/**
 * query information by domain
 * @param  {String}   domain   website domain
 * @param  {String}   format   format of the result, should be dict or 
 * @param  {Function} callback callback to receive result
 * @return {Null}            [description]
 */
IPIP.prototype.domain = function(domain, format, callback) {
  var context = this;
  var query = function(resolve, reject) {
    dns.resolve4(domain, function(err, addresses) {
      if (err) {
        return reject(err);
      }
      var ip = addresses.shift();
      resolve(context.ip(ip, format));
    });
  };

  if (arguments.length === 1) {
    // fluent flow control
    return new Promise(query);
  } else if (arguments.length === 2) {
    if (typeof format === 'function') {
      callback = format;
      format = 'dict';
    } else if (typeof format === 'string') {
      return new Promise(query);
    } else {
      throw new Error('Invalid function call');
    }
  } else if (arguments.length > 3) {
    throw new Error('Invalid function call');
  }

  query(function(result) {
    callback(null, result);
  }, function(err) {
    callback(err);
  });

};

/**
 * wrap result in given format
 * @param  {Object} result
 * @param  {String} format 
 * @return {Object|Array}
 */
IPIP.prototype._wrap = function(array, format) {
  format = format || 'dict';

  if (array === null) {
    array = Array.apply(null, new Array(4)).map(String.prototype.valueOf, 'N/A');
  }

  if (format === 'array') {
    return array;
  } else if (format === 'dict') {
    var dict = {};
    this._driver.columns.forEach(function(key, i) {
      dict[key] = array[i] || '';
    });
    return dict;
  } else {
    throw new Error('Invalid param');
  }
}

exports.IPIP = IPIP;
