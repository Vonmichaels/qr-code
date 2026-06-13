import { useState, useEffect } from 'react'
import AdminPage from './pages/AdminPage.jsx'
import GuestPage from './pages/GuestPage.jsx'
import { decodeGuest } from './utils/storage.js'

function getRoute() {
  const params = new URLSearchParams(window.location.search)
  const encoded = params.get('guest')
  if (!encoded) return { view: 'admin' }
  const guest = decodeGuest(encoded)
  return guest ? { view: 'guest', guest } : { view: 'invalid' }
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handler = () => setRoute(getRoute())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  if (route.view === 'guest') {
    return <GuestPage guest={route.guest} />
  }

  return <AdminPage />
}
