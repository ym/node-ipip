'use strict';

var expect = require('chai').expect,
  fs = require('fs'),
  Datx = require('../lib/datx.js');

var TEST_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.datx');
var content = fs.readFileSync(TEST_DATA_PATH);
var datx = new Datx(content);

describe('Dat reader', function() {
  it('should parse an ip', function(done) {
    var record = datx.lookup(0xCAC3A11E);
    expect(record).to.be.an.aray;
    expect(record).to.include.members(['中国', '江苏', '镇江', '江苏大学']);

    var record2 = datx.lookup(0xC0A80101);
    done();
  });
});