const WebSocketServer = require('ws').Server;
const fs = require('fs');
const pathSep = require('path').sep;

const __files = __dirname + pathSep + 'files';

module.exports = new class {
    init(httpServer) {
        let wss = new WebSocketServer({
            server: httpServer,
            perMessageDeflate: true,
        });
        wss.on('connection', socket => {
            socket.on('message', message => {
                if(message.byteLength) {
                    this.saveFile(message);
                    return;
                }
                if(typeof message === 'string') {
                    let data = JSON.parse(message);
                    if(data.action === 'upload-files') {
                        this.uploadingFile = data.filename;
                    }
                }
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
    saveFile(buffer) {
        if(!this.uploadingFile) {
            throw new Error('Can not find file name for this buffer');
        }
        console.log('writing file', this.uploadingFile);
        fs.writeFile(__files + pathSep + this.uploadingFile, Buffer.from(buffer), er => {
            if(er) {
                throw er;
            }
        });
    }
};
