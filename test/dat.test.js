// Generated by CoffeeScript 1.9.3
(function() {
  var Dat, TEST_DATA_PATH, content, dat, expect, fs;

  expect = require('chai').expect;

  fs = require('fs');

  Dat = require('../lib/dat.js');

  TEST_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.dat');

  content = fs.readFileSync(TEST_DATA_PATH);

  dat = new Dat(content);

  describe('Dat reader', function() {
    it('should parse an ip', function(done) {
      var record, record2;
      record = dat.lookup(0xCAC3A11E);
      expect(record).to.be.an.array;
      expect(record).to.include.members(['中国', '江苏', '镇江', '江苏大学']);
      record2 = dat.lookup(0xC0A80101);
      expect(record2).to.include.members(['局域网', '']);
      done();
    });
  });

}).call(this);
