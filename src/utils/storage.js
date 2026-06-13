const STORAGE_KEY = 'invite_guests'

export function getGuests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveGuest(guest) {
  const guests = getGuests()
  const existing = guests.findIndex(g => g.id === guest.id)
  if (existing >= 0) {
    guests[existing] = guest
  } else {
    guests.push(guest)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests))
}

export function deleteGuest(id) {
  const guests = getGuests().filter(g => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function encodeGuest(guest) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(guest))))
}

export function decodeGuest(encoded) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))))
  } catch {
    return null
  }
}
