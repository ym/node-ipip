{ expect } = require 'chai'

fs     = require 'fs'
Datx   = require '../lib/datx.js'

TEST_DATA_PATH = require 'path'
.join __dirname, '..', '17monipdb.datx'

describe 'Datx reader', ->
  if fs.existsSync(TEST_DATA_PATH)
    content = fs.readFileSync TEST_DATA_PATH
    datx = new Datx content

    it 'should parse an ip', (done) ->
      record = datx.lookup 0xCAC3A11E
      expect(record).to.be.an.array
      expect(record).to.include.members [
        '中国'
        '江苏'
        '镇江'
        '江苏大学'
      ]

      record3 = datx.lookup 0x00040404
      expect(record3).to.not.be.undefined

      done()
    it 'should return version of database', (done) ->
      info = datx.info()
      expect(info).to.be.a.object

      done()
  else
    it.skip 'skip due to missing database'
