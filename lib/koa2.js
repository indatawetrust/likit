'use strict';
module.exports = function(opts) {
  function _asyncToGenerator(fn) {
    return function() {
      var gen = fn.apply(this, arguments);
      return new Promise(function(resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }
          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(
              function(value) {
                step('next', value);
              },
              function(err) {
                step('throw', err);
              }
            );
          }
        }
        return step('next');
      });
    };
  }

  var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    es = new events.EventEmitter(),
    auth = require('basic-auth');

  var server = http.createServer(function(request, response) {
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

  var SSE = require('sse'), sse = new SSE(server);

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

  return (function() {
    var _ref = _asyncToGenerator(
      regeneratorRuntime.mark(function _callee(ctx, next) {
        var start, ms;
        return regeneratorRuntime.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  start = new Date();
                  _context.next = 3;
                  return next();

                case 3:
                  ms = new Date() - start;

                  es.emit('request', {
                    code: ctx.response.status,
                    method: ctx.request.method,
                    path: ctx.request.url,
                    time: ms,
                    request: ctx.request,
                    response: ctx.response,
                  });

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          },
          _callee,
          undefined,
        )
      }),
    );

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};
