import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import { ThemeProvider } from './contexts/ThemeProvider'
import { AuthProvider } from './contexts/AuthProvider'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="lereseau-ui-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { type: 'module' })
      .then(reg => {
        console.log('[PWA] Service Worker registered successfully with scope:', reg.scope)
      })
      .catch(err => {
        console.error('[PWA] Service Worker registration failed:', err)
      })
  })
}
