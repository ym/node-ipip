'use strict';

var expect = require('chai').expect,
  rewire = require('rewire'),
  ipip = rewire('../lib/ipip.js'),
  IPIP = ipip.IPIP;

var dnsMock = {
  resolve4: function(domain, callback) {
    if (domain === 'this.domain.does.not.exist') {
      callback(new Error('queryA ENOTFOUND'));
    } else {
      callback(null, ['8.8.8.8']);
    }
  }
};

describe('IPIP', function() {
  var ip = new ipip.IPIP();

  it('should handle malformed input', function(done) {
    expect(function() {
      ip.ip('202.x.x.x');
    }).to.throw(Error);

    expect(function() {
      ip.ip('256.1.1.1');
    }).to.throw(Error);

    expect(function() {
      ip.ip('8.8.4.4', 'invalid-format');
    }).to.throw(Error);

    expect(function() {
      ip.domain('8.8.4.4', 0);
    }).to.throw(Error);

    expect(function() {
      ip.domain.apply(ip, new Array(4));
    }).to.throw(Error);

    done();
  });

  it('shoudl accept numeric input', function() {
    expect(ip.ip(0x040404)).to.have.a.property('city');
  });

  it('should return a dictionary', function(done) {
    expect(ip.ip('202.195.161.30', 'dict')).to.have.a.property('city');
    done();
  });

  it('should fetch IP information for a domain', function(done) {
    ipip.__set__('dns', dnsMock);

    ip.domain('baidu.com', 'array').then(function(result) {
      expect(result).to.be.an.aray; 
      ip.domain('ujs.edu.cn').then(function(result) {
        expect(result).ok;
        ip.domain('this.domain.does.not.exist', function(err, result) {
          expect(err).ok;
          done();
        });
      });
    });
  });

  it('should return an array', function(done) {
    expect(ip.ip('8.8.8.8')).to.be.an.aray;

    ip.domain('qq.com', 'array', function(err, result) {
      expect(result).to.be.an('array');
      done();
    });
  });

});

describe('Custom options', function() {
  it('should be able to load data from custom location', function(done) {
    expect(function() {
      new IPIP('/tmp/non-exist-file.dat');
    }).to.throw(Error);
    
    expect(function() {
      new IPIP('package.json');
    }).to.throw(Error);

    var path = require('path').join(__dirname, '..', '17monipdb.dat');
    var ip = new IPIP();
    expect(ip.ip('8.8.8.8', 'dict')).to.have.a.property('city');

    done();
  });
});
