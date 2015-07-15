'use strict'
{ expect } = require 'chai'
rewire   = require 'rewire'
ipip     = rewire '../lib/ipip.js'

{ IPIP } = ipip

dnsMock = resolve4: (domain, callback) ->
  if domain is 'this.domain.does.not.exist'
    callback new Error 'queryA ENOTFOUND'
  else
    callback null, [ '8.8.8.8' ]

describe 'IPIP', ->
  ip = new IPIP

  (() ->
    info = ip.info()
    if Object.keys(info).length is 0
      it.skip 'skip due to missing database'
    else
      it 'should return version', (done) ->
        info.to.have.a.property 'version'
        done()
  )()

  it 'should handle malformed input', (done) ->
    expect( -> ip.ip '202.x.x.x' ).to.throw Error
    expect( -> ip.ip '256.1.1.1' ).to.throw Error
    expect( -> ip.ip '8.8.4.4', 'invalid-format' ).to.throw Error
    expect( -> ip.domain '8.8.4.4', 0 ).to.throw Error
    expect( -> ip.domain.apply ip, new Array(4) ).to.throw Error
    done()

  it 'shoudl accept numeric input', ->
    expect(ip.ip(0x040404)).to.have.a.property 'city'

  it 'should return a dictionary', (done) ->
    expect(ip.ip('202.195.161.30', 'dict')).to.have.a.property 'city'
    done()

  it 'should fetch IP information for a domain', (done) ->
    ipip.__set__ 'dns', dnsMock
    ip.domain('baidu.com', 'array').then (result) ->
      expect(result).to.be.an.aray
      ip.domain('ujs.edu.cn').then (result) ->
        expect(result).ok
        ip.domain 'this.domain.does.not.exist', (err, result) ->
          expect(err).ok
          done()

  it 'should return an array', (done) ->
    expect(ip.ip('8.8.8.8')).to.be.an.aray
    ip.domain 'qq.com', 'array', (err, result) ->
      expect(result).to.be.an 'array'
      done()

describe 'Custom options', ->
  it 'should be able to load data from custom location', (done) ->
    expect( -> new IPIP('/tmp/non-exist-file.dat') ).to.throw Error
    expect( -> new IPIP('package.json') ).to.throw Error

    path = require('path').join __dirname, '..', '17monipdb.dat'

    ip   = new IPIP

    expect(ip.ip('8.8.8.8', 'dict')).to.have.a.property 'city'
    done()
