# node-ipip [![Build Status](https://travis-ci.org/ChiChou/node-ipip.svg?branch=master)](https://travis-ci.org/ChiChou/node-ipip) [![Coverage Status](https://img.shields.io/coveralls/ChiChou/node-ipip.svg)](https://coveralls.io/r/ChiChou/node-ipip) [![npm version](https://badge.fury.io/js/ipip.svg)](http://badge.fury.io/js/ipip)

[中文文档](README.md)

A Node.js module to query geolocation information for an IP or domain, based on database by [ipip.net](http://ipip.net).


## Getting Started

Install the module:

    npm install ipip

[Database](http://s.qdcdn.com/17mon/17monipdb.zip) is provided by ipip.net. It will be downloaded automatically, no extra operations needed.

    var ipip = require('ipip');
    var ip = new ipip.IPIP();

    // lookup an ip
    console.log(ip.ip('202.195.161.30', 'dict'));

    // domain queries must be asynchronous
    ip.domain('ujs.edu.cn', 'dict', function(result) {
      console.log(result);
    });

## Documentation

### Query by IP

query(ip [, format])

**ip**

IP address that you want to query. e.g. `8.8.8.8`

**format** 

Format of the information, shoule be `array` or `dict`. 

When set to `dict` you'll get an object that consists of four keys: `country`, `province`, `city`, `organization`. e.g.:

    {
      country: '中国',
      province: '江苏',
      city: '镇江',
      organization: '江苏大学' 
    }

Otherwise, it returns an array as following format: `['country', 'province', 'city', 'organization']`.

### Query by domain name

domain(domain [, format], callback)

Due to dns query, this function must be asynchronous.

**domain**

Domain name that you want to query. e.g. `google.com`

**format** 

The same as `ip`. 

**callback**

Fires when result found. Should be declared as: `callback(err, result)`

## Promise support

Without `callback` parameter you can use another favor of async programming, the `Promise`. It's highly recommended.

    ip.domain('google.com').then(function(result) {
      // do the stuff
    });

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Use make to run unit test.

## License

(C) Copyright 2015 ChiChou. Licensed under the MIT license.
