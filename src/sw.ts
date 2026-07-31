/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope

// Precache resources
precacheAndRoute(self.__WB_MANIFEST || [])

// Push event listener
self.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    try {
      const payload = event.data.json()
      const title = payload.title || 'LeRéseau'
      const options = {
        body: payload.body || payload.message || '',
        icon: '/logo.png',
        badge: '/logo.png',
        data: payload.url || '/'
      }
      event.waitUntil(
        self.registration.showNotification(title, options)
      )
    } catch (e) {
      console.error('Failed to parse push event data:', e)
    }
  }
})

// Notification click listener
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    self.clients.openWindow(event.notification.data || '/')
  )
})
