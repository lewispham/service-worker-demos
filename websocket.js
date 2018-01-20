

let ws = new class {
    init() {
        let socket = this.socket = new WebSocket('ws://' + location.host);
        socket.addEventListener('open', () => {
            console.log('WebSocket connection opened');
            this.uploadFilesFromCache();
        });
        socket.addEventListener('message', event => {
            console.log(`Message from server: ${event.data}`);
        });
        socket.addEventListener('error', event => {
            console.log(event.error);
        });
        socket.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            setTimeout(() => {
                navigator.onLine && this.init();
            }, 3000);
        });
        window.addEventListener('online', () => {
            this.init();
        });
    }
    uploadFiles(files) {
        for(let file of files) {
            this.socket.send(JSON.stringify({
                action: 'upload-files',
                filename: file.name
            }));
            this.socket.send(file);
            console.log(`Uploading file ${file.name}`);
        }
    }
    uploadFilesFromCache() {
        caches.open('Cache').then(cache =>
            cache.keys().then(keys =>
                Promise.all(keys.map(request =>
                    cache.match(request).then(response =>
                        response.arrayBuffer().then(buffer => {
                            this.socket.send(JSON.stringify({
                                action: 'upload-files',
                                filename: request.url.slice(request.url.lastIndexOf('/') + 1)
                            }));
                            this.socket.send(buffer);
                            return cache.delete(request);
                        })
                    )
                ))
            )
        );
    }
}
ws.init();
