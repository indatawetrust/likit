module.exports = function responseTime(){
  return function(req, res, next){
    var start = new Date;

    if (res._responseTime) return next();
    res._responseTime = true;

    res.on('header', function(){
console.log(11)
      var duration = new Date - start;
      res.setHeader('X-Response-Time', duration + 'ms');
    });

    next();
  };
};
