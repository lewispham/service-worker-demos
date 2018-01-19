const http = require('http');
const fs = require('fs');
const mime = require('mime');

module.exports = new class {
    init() {
        return http.createServer((req, res) => {
            let filepath = req.url;
            if(filepath === '/') {
                filepath = '/main.html';
            }
            let fstream = fs.createReadStream(__dirname + filepath);
            fstream.on('open', () => {
                fstream.pipe(res);
                res.writeHead(200, {
                    'Content-Type': mime.getType(filepath.slice(filepath.lastIndexOf('.') + 1)),
                    'Cache-Control': 'no-cache'
                });
            });
            fstream.on('error', er => {
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache'
                });
                res.end(`
                    <h1>File Not Found</h1>
                `);
                console.log(er);
            });
        }).listen(80, '127.0.0.1');

    }
}
