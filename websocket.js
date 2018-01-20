let ws = new class {
    init() {
        let ws = this.socket = new WebSocket('ws://' + location.host);
        ws.addEventListener('open', () => {
            console.log('WebSocket connection opened');
        });
        ws.addEventListener('message', event => {
            console.log(`Message from server: ${event.data}`);
        });
        ws.addEventListener('error', event => {
            console.log(event.error);
        });
        ws.addEventListener('close', () => {
            console.log('WebSocket connection closed');
            setTimeout(() => {
                navigator.onLine && this.init();
            }, 3000);
        });
        window.addEventListener('online', () => {
            this.init();
        });
    }
}
ws.init();
