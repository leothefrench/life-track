// Life-Track Service Worker for PWA Notifications
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Réception des notifications Push
self.addEventListener('push', (event) => {
  let data = {
    title: 'Life-Track Alerte Budget',
    body: 'Attention, vous approchez de votre limite de dépenses ce mois-ci.',
    icon: '/icon-512.png',
    badge: '/icon-512.png',
    url: '/dashboard',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-512.png',
    badge: data.badge || '/icon-512.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clic sur une notification : ouverture de l'application
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
