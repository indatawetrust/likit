const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  events = require('events'),
  es = new events.EventEmitter(),
  auth = require('basic-auth')

module.exports = opts => {
  const server = http.createServer(function(request, response) {
    var credentials = auth(request);

    if (
      !credentials ||
      credentials.name !== (opts.username || 'admin') ||
      credentials.pass !== (opts.password || 'admin')
    ) {
      response.statusCode = 401;
      response.setHeader('WWW-Authenticate', 'Basic realm="example"');
      response.end('Access denied');
    } else {
      fs.readFile(
        path.join(process.cwd(), 'node_modules/likit/lib/index.html'),
        'binary',
        function(err, file) {
          response.writeHead(200);
          response.write(file, 'binary');
          response.end();
        }
      );
    }
  });

  const SSE = require('sse'), sse = new SSE(server);

  sse.on('connection', function(connection) {
    es.on('request', function(val) {
      connection.send({
        event: 'likit',
        data: JSON.stringify(val),
      });
    });
  });

  server.listen(opts.port || 3001);

  opts.app.on('error', function(err, ctx) {
    es.emit('request', {
      code: ctx.response.status,
      method: ctx.request.method,
      path: ctx.request.url,
      time: 0,
      request: ctx.request,
      response: ctx.response,
      error: err.toString(),
    });
  });

  return function*(next) {
    const start = new Date();
    yield next;
    const ms = new Date() - start;

    es.emit('request', {
      code: this.response.status,
      method: this.method,
      path: this.url,
      time: ms,
      request: this.request,
      response: this.response,
    });
  };
};
