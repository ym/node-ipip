'use strict';

var expect = require('chai').expect,
  fs = require('fs'),
  Dat = require('../lib/dat.js');

var TEST_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.dat');
var content = fs.readFileSync(TEST_DATA_PATH);
var dat = new Dat(content);

describe('Dat reader', function() {
  it('should parse an ip', function(done) {
    var record = dat.lookup(0xCAC3A11E);
    expect(record).to.be.an.aray;
    expect(record).to.include.members(['中国', '江苏', '镇江', '江苏大学']);

    var record2 = dat.lookup(0xC0A80101);
    expect(record2).to.include.members(['局域网', '']);
    done();
  });
});