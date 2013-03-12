var http = require("http");
var https = require("https");
var path = require("path");
var fs = require("fs-extra");
var winston = require("winston");
var yaml = require("js-yaml");

// Configuration
var cfgFile = path.join(__dirname, "config.yml");
var cfg = exports.config = fs.existsSync(cfgFile) ? yaml.load(fs.readFileSync(cfgFile, "utf-8")) : {};
cfg.root = cfg.root || path.join(process.env.HOME || process.env.USERPROFILE, ".scale");
fs.mkdirsSync(cfg.root);
cfg.file = cfgFile;
cfg.port = cfg.port || 1431;
cfg.pidFile = cfg.pidFile || path.join(cfg.root, "scale.pid");
cfg.logFile = cfg.logFile || path.join(cfg.root, "scale.log");
fs.writeFileSync(cfgFile, yaml.dump(cfg));

// Logging
var logger = exports.logger = new winston.Logger({
  transports: [
  new winston.transports.File({
    filename: cfg.logFile
  })]
});

// Round-robin pointer
var i = 0;

exports.route = function(req, res) {
  // No servers defined
  if (!cfg.servers || !cfg.servers.length) {
    res.writeHead(503);
    logger.error("no servers defined for load-balancing");
    return res.end();
  }

  var server;
  var client;

  switch (cfg.technique) {
    case "random":
      i = ~~ (Math.random() * cfg.servers.length);
      break;
    case "roundrobin":
      if (i++ === cfg.servers.length) {
        i = 0;
      }
  }
  server = cfg.servers[i];

  if (server.protocol === "http") {
    server.port = server.port || 80;
    client = http;
  } else if (server.protocol === "https") {
    server.port = server.port || 443;
    client = https;
  } else {
    throw new Error("protocol not supported");
  }

  // Intercept headers
  req.headers.host = server.hostname + ":" + server.port;

  var opts = {
    hostname: server.hostname,
    port: server.port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  var sReq = client.request(opts, function(sRes) {
    res.writeHead(sRes.statusCode, sRes.headers);
    sRes.pipe(res);
  });
  sReq.end();
};
