import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import mahreenFavicon from './assets/icon.webp'

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) {
  favicon.href = mahreenFavicon
  favicon.type = 'image/webp'
}

const CHUNK_RECOVERY_KEY = 'mahreen:chunk-recovery'
const CHUNK_ERROR_PATTERN = /(?:Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed|Unable to preload CSS|Failed to preload CSS)/i

const recoverFromStaleChunk = () => {
  const currentUrl = window.location.href
  const now = Date.now()

  try {
    const previousRaw = window.sessionStorage.getItem(CHUNK_RECOVERY_KEY)
    const previous = previousRaw
      ? JSON.parse(previousRaw) as { url?: string; timestamp?: number }
      : null

    if (
      previous?.url === currentUrl &&
      typeof previous.timestamp === 'number' &&
      now - previous.timestamp < 120_000
    ) {
      return false
    }

    window.sessionStorage.setItem(
      CHUNK_RECOVERY_KEY,
      JSON.stringify({ url: currentUrl, timestamp: now }),
    )
  } catch {
    // sessionStorage dapat diblokir oleh mode privasi; reload tetap dicoba sekali
    // selama instance halaman ini masih aktif.
  }

  window.location.reload()
  return true
}

let chunkRecoveryStarted = false

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  if (chunkRecoveryStarted) return
  chunkRecoveryStarted = recoverFromStaleChunk()
})

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  const message = reason instanceof Error ? reason.message : String(reason ?? '')

  if (!CHUNK_ERROR_PATTERN.test(message) || chunkRecoveryStarted) return

  chunkRecoveryStarted = recoverFromStaleChunk()
  if (chunkRecoveryStarted) event.preventDefault()
})

window.addEventListener('error', (event) => {
  const message = event.error instanceof Error ? event.error.message : event.message

  if (!CHUNK_ERROR_PATTERN.test(message) || chunkRecoveryStarted) return

  chunkRecoveryStarted = recoverFromStaleChunk()
})

const rootElement = document.getElementById('root')!
const application = (
  <StrictMode>
    <App />
  </StrictMode>
)

const hasCachedAuthentication = () => {
  try {
    return Boolean(
      window.sessionStorage.getItem('mahreen:auth:session') ||
      window.sessionStorage.getItem('mahreen:auth:user') ||
      window.localStorage.getItem('mahreen:auth:session') ||
      window.localStorage.getItem('mahreen:auth:user'),
    )
  } catch {
    return true
  }
}

const canHydrateHomepage =
  rootElement.hasChildNodes() &&
  window.location.pathname.replace(/\/+$/, '') === '' &&
  window.location.search === '' &&
  window.location.hash === '' &&
  window.scrollY <= 12 &&
  !hasCachedAuthentication()

if (canHydrateHomepage) {
  hydrateRoot(rootElement, application)
} else {
  if (rootElement.hasChildNodes()) rootElement.replaceChildren()
  createRoot(rootElement).render(application)
}
