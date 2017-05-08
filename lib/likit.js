const http = require('http'),
      fs = require('fs'),
      path = require('path'),
      EventEmitter2 = require('eventemitter2').EventEmitter2,
      es = new EventEmitter2({
        newListener: false,
      }),
      responseTime = require('response-time')

const server = http.createServer(function(request, response) {

  fs.readFile(path.join(process.cwd(), 'node_modules/likit/index.html'), "binary", function(err, file) {
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
  
  return function *(next) {
    const start = new Date;
    yield next;
    const ms = new Date - start;

    es.emit('request', {
      code: this.response.status,
      method: this.method,
      path: this.url,
      time: ms
    })

  }

}
