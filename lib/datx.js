'use strict';

var HEADER_SIZE = 0x40000;
var BLOCK_SIZE = 9;

/**
 * driver for datx format provided by ipip.net
 * @param {Buffer} buffer file content
 */
var Datx = function Dat(buffer) {
  this.buffer = buffer;
  this.len = buffer.readInt32BE(0);
};

/**
 * lookup an ip
 * @param  {Integer} ip IPv4 address in int
 * @return {Array}    lookup result
 */
Datx.prototype.lookup = function(ip) {
  var partition = (ip & 0xFFFF0000) >>> 14;

  var floor = this.buffer.readInt32LE(partition + 4) * BLOCK_SIZE + HEADER_SIZE;
  var ceil = this.len - HEADER_SIZE - 4;

  // binary search
  var low = 0;
  var high = Math.floor((ceil - floor) / BLOCK_SIZE);
  var mid;

  while (low <= high) {
    mid = (low + high) >>> 1;
    var offset = floor + mid * BLOCK_SIZE + 4;
    var a = this.buffer.readInt32BE(offset) >>> 0;
    var b = this.buffer.readInt32BE(offset + BLOCK_SIZE) >>> 0;

    if (b < ip) {
      low = mid + 1;
    } else if (a > ip) {
      high = mid - 1;
    } else {
      // found
      offset += 9;
      var index = this.buffer.readInt32LE(offset + 4) >>> 0;
      var recordOffset = (index & 0x00FFFFFF) + this.len - HEADER_SIZE;
      var recordLength = this.buffer.readUInt8(offset + 8);
      return this.buffer.slice(recordOffset, recordOffset + recordLength).toString().split('\t');
    }
  }

  return null;
};

/**
 * record columns
 * @type {Array}
 */
Datx.prototype.columns = ['country', 'province', 'city', 'organization',
  'isp', 'latitude', 'longitude', 'timezone', 'timezone2', 'governcode'];

module.exports = Datx;