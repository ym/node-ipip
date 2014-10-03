# ip17mon [![Build Status](https://travis-ci.org/ChiChou/ip17mon.svg?branch=master)](https://travis-ci.org/ChiChou/ip17mon) [![Coverage Status](https://img.shields.io/coveralls/ChiChou/ip17mon.svg)](https://coveralls.io/r/ChiChou/ip17mon)

[中文文档](README.md)

A Node.js module to query location information for a given IP or domain name, based on database by [17mon.cn](http://tool.17mon.cn).

Forked from: [ilsanbao/17moncn](https://github.com/ilsanbao/17moncn/tree/master/ip/nodejs)

## Getting Started

[Database](http://s.qdcdn.com/17mon/17monipdb.dat) is provided by 17mon.cn. It will be downloaded automatically, no extra operations needed.

    var ip17mon = require('ip17mon');
    console.log(ip17mon.query('202.195.161.30', 'dict')); 
    //domain query must be asynchronous
    ip17mon.queryDomain('ujs.edu.cn', 'dict', function(result) {
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

queryDomain(domain [, format], callback)

Due to dns query, this function must be asynchronous.

**domain**

Domain name that you want to query. e.g. `google.com`

**format** 

The same as `query`. 

**callback**

Fires when result found. Returns `{}` or `[]` when failed, format depends on the former paramer.

Should be declared as: `callback(result)`

## Examples

    ip17mon.query('202.195.161.30', 'dict');

    /*
    returns:
    {
        country: '中国',
        province: '江苏',
        city: '镇江',
        organization: '江苏大学' 
    }
    */

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Use make to run unit test.

## Release History

### r2 Redesign API

Redesign interface

### r1 Initial Version

Reconstructed from [ilsanbao/17moncn](https://github.com/ilsanbao/17moncn/tree/master/ip/nodejs)

## License

Copyright (c) 2014 ChiChou. Licensed under the MIT license.
