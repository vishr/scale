var http = require("http");
var net = require("net");
var util = require("util");
var async = require("async");
var _ = require("lodash");
var scale = require("./scale");
var logger = require("./scale").logger;
var cfg = require("./scale").config;

var server = http.createServer(function(req, res) {
  scale.route(req, res);
}).listen(cfg.port);

server.on("error", function(err) {
  logger.error(err);
});

server.on("listening", function() {
  // Port forwarding
  async.parallel(_.map(cfg.forward, function(fwd) {
    return function(cb) {
      var server = net.createServer(function(srv) {
        var clt = net.connect(fwd.target.port);
        srv.pipe(clt);
        clt.pipe(srv);
      });

      server.listen(fwd.port, function() {
        logger.info(util.format("forwarded port %d => %s:%d", fwd.port, fwd.target.hostname, fwd.target.port));
        cb();
      });

      server.on("error", function(err) {
        cb(err);
      });
    };
  }), function(err) {
    if (err) {
      return logger.error(err);
    }
    logger.info("scale started on port " + cfg.port);
  });
});