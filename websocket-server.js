const WebSocketServer = require('uws').Server;

module.exports = new class {
    init(httpServer) {
        let wss = new WebSocketServer({
            server: httpServer,
            perMessageDeflate: false,
        });
        wss.on('connection', socket => {
            socket.on('message', message => {
                console.log(`Message from client: ${message}`);
            });
            socket.on('close', () => {
                console.log('WebSocket connection closed');
            });
            socket.on('error', er => {
                console.log(er);
            });
        });
        wss.on('error', er => {
            console.log(er);
        });
        return wss;
    }
};
