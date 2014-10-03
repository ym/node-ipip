'use strict';

var expect = require('chai').expect,
    ip17mon = require('../lib/ip17mon.js');

describe('Regular Query', function() {
    var ip = ip17mon();

    it('should handle malformed input', function(done) {
        expect(ip.query('202.x.x.x', 'dict')).to.be.empty;
        expect(ip.query('-1.-1.-1.-1')).to.be.empty;

        ip.queryDomain('thisdomainshallneverexsts', 'dict', function(result) {
            expect(result).to.be.empty;
            done();
        });
    });

    it('should return as dictionary', function(done) {
        expect(ip.query('202.195.161.30', 'dict')).to.have.a.property('city');

        ip.queryDomain('baidu.com', 'dict', function(result) {
            expect(result).ok;
            done();
        });
    });

    it('should return an array', function(done) {
        expect(ip.query('8.8.8.8')).to.be.an.aray;

        ip.queryDomain('google.com', function(result) {
            expect(result).to.be.an('array'); 
            done();
        });  
    });

});

describe('Custom options', function() {

    it('should be able to load data from non-default location', function(done) {
        expect(function() {
            ip17mon('/tmp/non-exist-file.dat');
        }).to.throw(Error);

        var ip = ip17mon(require('path').join(__dirname,
            "..", "17monipdb.dat"));
        expect(ip.query('8.8.8.8', 'dict')).to.have.a.property('city');

        done();
    });

    it('should throw and error when' + 
            ' query malformed and throwsOnError is set', function(done) {
        var ip = ip17mon({throwOnError: true});
        expect(ip.query).to.throw(Error);
        done();
    });
});