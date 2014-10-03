/*
 * ip17mon
 * tool.17mon.cn
 *
 * Copyright (c) 2014 ilsanbao & other contributors
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    dns = require('dns');

var DEFAULT_DATA_PATH = require('path').join(
    __dirname, "..", "17monipdb.dat");

/**
 * 17Mon IP database query interface
 * @param {Object} opt Options
 */
function IP17Mon(opt) {

    if (typeof opt === 'string') {
        this._database = opt;
    } else {
        opt = opt || {};
        this._database = opt.data || DEFAULT_DATA_PATH;    
    }

    this._throwOnError = opt.throwOnError || opt.throwOnErr;
    // notice: this will block whole application while initializing
    this._rawData = fs.readFileSync(this._database);

}


/**
 * query ip data
 * @param {String} name ip or domain to query
 * @param {Function} callback
 */

IP17Mon.prototype.query = function (ip, format) {
    var error = false;

    // if data is ready
    if (!this._rawData) {
        error = "Failed to read records. Database not ready";
    }

    // check IP format (actually this is not strict enough)
    if (!(ip.match(/^(\d{1,3}\.){3}\d{1,3}$/))) {
        error = "Invalid IP address";
    }

    if (error) {
        if (this._throwOnError) {
            throw error;
        }
        return format === 'dict' ? {} : [];
    }

    var ipArray = ip.trim().split('.') || ['0'],
        ipInt = new Buffer(ipArray).readInt32BE(0),

        length = this._rawData.readInt32BE(0),
        partition = ipArray[0] * 4,

        indexBuffer = this._rawData.slice(4, length),
        indexOffset = -1,
        indexLenth = -1,

        offset = indexBuffer.slice(partition, partition + 4).readInt32LE(0) * 8 + 1024;

    while (offset < length - 1024 - 4) {
        if (indexBuffer.slice(offset, offset + 4).readInt32BE(0) >= ipInt) {
            indexOffset = ((indexBuffer[offset + 6] << 16) + 
                (indexBuffer[offset + 5] << 8) + indexBuffer[offset + 4]);
            indexLenth = indexBuffer[offset + 7];
            break;
        }
        offset += 8;
    }

    var array = [];
    if (indexOffset !== -1 && indexLenth !== -1) {
        // found
        offset = length + indexOffset - 1024;
        array = this._rawData.slice(offset, 
            offset + indexLenth).toString('utf-8').split("\t");
    }

    // convert array to an object
    var wrap = function(array) {
        var dict = {};
        ['country', 'province', 'city', 'organization'].forEach(function(key, i) {
            dict[key] = array[i] || '';
        });
        return dict;
    };

    return format === 'dict' ? 
        wrap(array) :
        array;
};


/**
 * query via domain
 * @param {String} domain domain to query
 * @param {String} format use 'dict' to return an object, otherwise returns an array
 * @param {Function} callback
 */

IP17Mon.prototype.queryDomain = function (domain, format, callback) {
    var instance = this;
    callback = callback || format;

    dns.resolve4(domain, function (err, addresses) {
        if (err) {
            callback(format === 'dict' ? {} : []);
            return;
        }
        var ip = addresses.shift();

        callback(instance.query(ip, format));
    });
};

// export module
exports = function(opt) {
    return new IP17Mon(opt);
};

module.exports = exports;