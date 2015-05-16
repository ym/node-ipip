# node-ipip [![Build Status](https://travis-ci.org/ChiChou/node-ipip.svg?branch=master)](https://travis-ci.org/ChiChou/node-ipip) [![Coverage Status](https://img.shields.io/coveralls/ChiChou/node-ipip.svg)](https://coveralls.io/r/ChiChou/node-ipip)

[English Document](README.en.md)

适用于 Node.js 的 [ipip.net](http://ipip.net) IP 数据库查询模块。

## 入门

[IP 地址库](http://s.qdcdn.com/17mon/17monipdb.dat) 由 17mon 提供，在 `npm install` 过程中将自动下载。

代码示例

    var ipip = require('ipip').get();
    ...
    // 查询 IP 信息，以字典格式返回
    console.log(ipip.ip('202.195.161.30'));
    // 域名的接口必须使用异步调用
    ip17mon.domain('ujs.edu.cn').then(function(result) {
        console.log(result);
    }).catch(function(err) {
        // error occured
    });

## 文档

### 查 IP

IPIP.ip(ip [, format])

**ip**

待查询的 IP 地址，如 `8.8.8.8`

**format** 

制定返回数据的格式，可设置为 `array` 或者 `dict`。 

对于免费版（dat 格式）数据，包含国家、省份、城市、组织。收费版（datx 正在支持中）。

设为 `array`（缺省）时返回格式如下：
    
    ['国家', '省份', '城市', '组织']

设为 `dict` 时返回格式如下：

    {
        country: '国家',
        province: '省份',
        city: '城市',
        organization: '组织' 
    }

### 查询域名

IP17Mon.domain(domain [, format], callback)

由于需要查询 DNS，本函数只能通过异步调用。

**domain**

域名，如 `google.com`

**format** 

同上。

**callback**

处理结果的回调函数，只接受一个参数，格式之前的 `format` 参数决定。

## 示例

    ipip.domain('ujs.edu.cn', function(result) {
        /*
        yields:
        {
            country: '中国',
            province: '江苏',
            city: '镇江',
            organization: '江苏大学' 
        }
        */
    });


## Promise 用法

对于 domain方法，在 node 引擎支持 Promise 的环境中，省略 `callback` 参数即可返回一个 Promise 对象。

    ipip.domain()


## 提示

程序在初始化过程中会一次性加载数据库到内存，消耗一定 RAM 并阻塞线程。请注意管理模块实例以免发生内存泄露。