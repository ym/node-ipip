###*
# IPIP database reader
# @param {Object|String} opt initialize options
###

IPIP = (opt) ->
  if typeof opt == 'string'
    @_database = opt
    @_version = opt.split('.').pop()
  else
    opt = opt or {}
    @_database = opt.data or DEFAULT_DATA_PATH
    @_version = opt.version or @_database.split('.').pop()
  if !@_version.match(/^datx?$/i)
    throw new Error('Invalid database version')
  Driver = require('./' + @_version)
  # note: it blocks the application
  buffer = fs.readFileSync(@_database)
  @_driver = new Driver(buffer)
  return

'use strict'
fs = require('fs')
dns = require('dns')
net = require('net')
DEFAULT_DATA_PATH = require('path').join(__dirname, '..', '17monipdb.dat')

###*
# query information by ip address
# @param  {String} ip IPv4 address
# @return {Object|Array}    query result
###

IPIP::ip = (ip, format) ->
  ipInt = 0
  if typeof ip == 'number'
    ipInt = ip
  else if net.isIPv4(ip)
    ipInt = ip.split('.').reverse().map((v, i) ->
      v << 8 * i
    ).reduce((a, b) ->
      a + b
    ) >>> 0
  if isNaN(ipInt) or ipInt <= 0 or ipInt > 0xFFFFFFFF
    throw new Error('Invalid ip address: ' + ip)
  result = @_driver.lookup(ipInt)
  @_wrap result, format

###*
# query information by domain
# @param  {String}   domain   website domain
# @param  {String}   format   format of the result, should be dict or
# @param  {Function} callback callback to receive result
# @return {Null}            [description]
###

IPIP::domain = (domain, format, callback) ->
  context = this

  query = (resolve, reject) ->
    dns.resolve4 domain, (err, addresses) ->
      if err
        return reject(err)
      ip = addresses.shift()
      resolve context.ip(ip, format)
      return
    return

  if arguments.length == 1
    # fluent flow control
    return new Promise(query)
  else if arguments.length == 2
    if typeof format == 'function'
      callback = format
      format = 'dict'
    else if typeof format == 'string'
      return new Promise(query)
    else
      throw new Error('Invalid function call')
  else if arguments.length > 3
    throw new Error('Invalid function call')
  query ((result) ->
    callback null, result
    return
  ), (err) ->
    callback err
    return
  return

###*
# wrap result in given format
# @param  {Object} result
# @param  {String} format
# @return {Object|Array}
###

IPIP::_wrap = (array, format) ->
  format = format or 'dict'
  if array == null
    array = @_driver.columns.map(String::valueOf, 'N/A')
  if format == 'array'
    return array
  else if format == 'dict'
    dict = {}
    @_driver.columns.forEach (key, i) ->
      dict[key] = array[i] or ''
      return
    return dict
  else
    throw new Error('Invalid param')
  return

exports.IPIP = IPIP

# ---
# generated by js2coffee 2.1.0