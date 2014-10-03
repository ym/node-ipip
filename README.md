# ip17mon [![Build Status](https://travis-ci.org/ChiChou/ip17mon.svg?branch=master)](https://travis-ci.org/ChiChou/ip17mon) [![Coverage Status](https://img.shields.io/coveralls/ChiChou/ip17mon.svg)](https://coveralls.io/r/ChiChou/ip17mon)

[English Document](README.en.md)

适用于 Node.js 的 [17mon.cn](http://tool.17mon.cn) IP 数据库查询模块。

## 入门

[IP 地址库](http://s.qdcdn.com/17mon/17monipdb.dat) 由 17mon 提供，在 `npm install` 过程中将自动下载。

代码示例

    var ip17mon = require('ip17mon')();
    // 查询 IP 信息，以字典格式返回
    console.log(ip17mon.query('202.195.161.30', 'dict'));
    // 域名的接口必须使用异步调用
    ip17mon.queryDomain('ujs.edu.cn', 'dict', function(result) {
        console.log(result);
    });

## 文档

### 查 IP

IP17Mon.query(ip [, format])

**ip**

待查询的 IP 地址，如 `8.8.8.8`

**format** 

制定返回数据的格式，可设置为 `array` 或者 `dict`。 

默认是长度为4的数组，包含国家、省份、城市、单位信息。

设为 `dict` 时返回格式如下：

    {
        country: '国家',
        province: '省份',
        city: '城市',
        organization: '单位' 
    }

### 查询域名

IP17Mon.queryDomain(domain [, format], callback)

由于需要查询 DNS，本函数只能通过异步调用。

**domain**

域名，如 `google.com`

**format** 

同上。

**callback**

处理结果的回调函数，只接受一个参数，格式之前的 `format` 参数决定。

## 示例

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

## 提示

程序在初始化过程中会一次性加载数据库到内存，消耗一定 RAM 并阻塞线程。请注意管理模块实例以免发生内存泄露。