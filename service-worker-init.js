navigator.serviceWorker.register('/service-worker.js', {
    scope: '/'
}).then(() => {
    console.log('Service Worker is successfully registered');
}, er => {
    console.log(er);
});
