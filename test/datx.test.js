'use strict';

// NOTE: 
//   bacause datx file requires payment, 
//   you should manually purchase and put it in the root folder

var expect = require('chai').expect,
  rewire = require('rewire'),
  fs = require('fs'),
  Datx = rewire('../lib/datx.js');


var TEST_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.datx');

function getReader(callback) {
  fs.readFile(TEST_DATA_PATH, function(err, content) {
    if (err && err.code === 'ENOENT') {
      // datx does not exists, fall back to dat test case
      fs.readFile(TEST_DATA_PATH.replace(/x$/, ''), function(err, content) {
        var mock = {
          HEADER_SIZE: 0x400,
          IP_MASK: 0xFF000000,
          BLOCK_SIZE: 8,
          PARTITION_FACTOR: 22,
          LEN_OFFSET: 7
        };

        for (var i in mock) {
          Datx.__set__(i, mock[i]);
        }

        var datx = new Datx(content);
        callback(datx);
      });
    } else {
      var datx = new Datx(content);
      callback(datx);  
    }
    
  });
}

describe('Datx reader', function() {
  it('should parse an ip', function(done) {
    getReader(function(datx) {
      var record = datx.lookup(0xCAC3A11E);
      expect(record).to.be.an.aray;
      expect(record).to.include.members(['中国', '江苏', '镇江', '江苏大学']);

      var record3 = datx.lookup(0x00040404);
      expect(record3).to.not.be.undefined;

      done();
    });

  });
});
