'use strict';

var assert = require('assert');

/**
 * driver for dat format provided by ipip.net
 * @param {Buffer} buffer file content
 */
var Dat = function Dat(buffer) {
  this.buffer = buffer;
  this.len = buffer.readInt32BE(0);
};

/**
 * lookup an ip
 * @param  {Integer} ip IPv4 address in int
 * @return {Array}    lookup result
 */
Dat.prototype.lookup = function(ip) {
  var partition = (ip & 0xFF000000) >>> 22;

  var floor = this.buffer.readInt32LE(partition + 4) * 8 + 1024;
  var ceil = this.len - 1024 - 4;

  // binary search
  var low = 0;
  var high = (ceil - floor) >>> 3;
  var mid;

  while (low <= high) {
    mid = (low + high) >>> 1;
    var offset = floor + mid * 8 + 4;
    var a = this.buffer.readInt32BE(offset) >>> 0;
    var b = this.buffer.readInt32BE(offset + 8) >>> 0;

    if (b < ip) {
      low = mid + 1;
    } else if (a > ip) {
      high = mid - 1;
    } else {
      // found
      var index = this.buffer.readInt32LE(offset + 12) >>> 0;
      var recordOffset = (index & 0x00FFFFFF) + this.len - 1024;
      var recordLength = (index & 0xFF000000) >>> 24;
      return this.buffer.slice(recordOffset, recordOffset + recordLength).toString().split('\t');
    }
  }

  return null;
};

/**
 * record columns
 * @type {Array}
 */
Dat.prototype.columns = ['country', 'province', 'city', 'organization'];

module.exports = Dat;
