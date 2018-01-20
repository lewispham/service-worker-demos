let uploader = new class {
    init() {
        document.querySelector('.upload-files').onchange = event => {
            let files = event.target.files;
            if(files.length === 0) {
                return;
            }
            navigator.onLine ? ws.uploadFiles(files) : this.cacheFiles(files);
        };
    }
    cacheFiles(files) {
        console.log('Caching files');
        caches.open('Cache').then(cache => {
            return Promise.all(Array.from(files).map(file => {
                return cache.put(new Request(`/files/${file.name}`), new Response(file, {
                    status: 200,
                    headers: {
                        'Content-Type': file.type
                    }
                }));
            }));
        }).then(() => {
            console.log('All uploaded files are cached');
        });
    }
}
uploader.init();
