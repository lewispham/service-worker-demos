const httpServer = require('./http-server.js');
const wss = require('./websocket-server.js');
wss.init(httpServer.init());
