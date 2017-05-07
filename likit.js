const http = require('http'),
      fs = require('fs'),
      EventEmitter2 = require('eventemitter2').EventEmitter2,
      es = new EventEmitter2({
        newListener: false,
      }),
      koa2 = require('./lib/koa2')

const server = http.createServer(function(request, response) {
  
  fs.readFile('./index.html', "binary", function(err, file) {
    response.writeHead(200);
    response.write(file, "binary");
    response.end();
  });

});

const SSE = require('sse'),
      sse = new SSE(server)

module.exports = (opts) => {

  sse.on('connection', function (connection) {

    es.on('request', function(val) {
       connection.send({
        event: 'likit',
        data: JSON.stringify(val)
      })

    })

  })

  server.listen(opts.port || 3001)

  return {
    koa2: koa2(es)
  }

}
