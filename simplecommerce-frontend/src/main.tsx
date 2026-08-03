import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Sayfa bfcache'den (geri/ileri tuşuyla) geri geldiğinde, o anki DOM/JS state'i
// (ör. o an giriş yapmış olan başka bir müşterinin verileri) donmuş haliyle
// gösterilmesin diye sayfayı zorla yeniden yükle.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
