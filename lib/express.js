const http = require('http'),
  fs = require('fs'),
  path = require('path'),
  events = require('events'),
  es = new events.EventEmitter();
responseTime = require('response-time'),
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

  opts.app.use(
    responseTime((req, res, time) => {
      es.emit('request', {
        code: res.statusCode,
        method: req.method,
        path: req.url,
        time: time.toFixed(2),
        request: req.headers,
        response: res._headers,
      });
    })
  );

  return (req, res, next) => {
    next();
  };
};
