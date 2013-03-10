var http = require("http");
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
  logger.info("scale started on port " + cfg.port);
});