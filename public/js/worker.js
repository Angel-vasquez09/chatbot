console.log('Registrado correctamente');

self.addEventListener('push', e => {
    const data = e.data.json();
    self.registration.showNotification(data.title,{
        body: data.message,
        vibrate: [100,50,100],
        icon: 'https://www.clipartkey.com/mpngs/m/101-1015371_chat-png-icon-free-download-searchpng-chat-icon.png',
    });
});


self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://www.facebook.com/')
    );
});
