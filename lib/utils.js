// Generated by CoffeeScript 1.9.3
(function() {
  exports.long2ip = function(ip) {
    return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
  };

}).call(this);
