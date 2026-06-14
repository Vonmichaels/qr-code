import { useState, useEffect } from 'react'
import { getGuests, deleteGuest } from '../utils/storage.js'
import GuestForm from '../components/GuestForm.jsx'
import GuestCard from '../components/GuestCard.jsx'
import InviteModal from '../components/InviteModal.jsx'
import CheckInPage from './CheckInPage.jsx'

export default function AdminPage() {
  const [tab, setTab] = useState('guests')
  const [guests, setGuests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editGuest, setEditGuest] = useState(null)
  const [previewGuest, setPreviewGuest] = useState(null)

  function refresh() {
    setGuests(getGuests())
  }

  useEffect(() => {
    refresh()
  }, [])

  function handleDelete(id) {
    if (!confirm('Delete this guest invitation?')) return
    deleteGuest(id)
    refresh()
  }

  function handleEdit(guest) {
    setEditGuest(guest)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditGuest(null)
    refresh()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Invite Manager</h1>
              <p className="text-xs text-gray-500">9th Birthday of Brando</p>
            </div>
          </div>

          {tab === 'guests' && (
            <button
              onClick={() => { setEditGuest(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Guest
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <TabBtn active={tab === 'guests'} onClick={() => setTab('guests')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
              label="Guests"
              count={guests.length}
            />
            <TabBtn active={tab === 'checkins'} onClick={() => setTab('checkins')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              label="Check-ins"
              live
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === 'guests' ? (
          <>
            {guests.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No guests yet</h2>
                <p className="text-gray-400 mb-6">Create your first guest invitation with a QR code</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create First Invitation
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {guests.length} Guest{guests.length !== 1 ? 's' : ''}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {guests.map(guest => (
                    <GuestCard
                      key={guest.id}
                      guest={guest}
                      onEdit={() => handleEdit(guest)}
                      onDelete={() => handleDelete(guest.id)}
                      onPreview={() => setPreviewGuest(guest)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <CheckInPage />
        )}
      </main>

      {showForm && (
        <GuestForm existing={editGuest} onClose={handleFormClose} />
      )}

      {previewGuest && (
        <InviteModal
          guest={previewGuest}
          onClose={() => setPreviewGuest(null)}
          onDelete={() => { handleDelete(previewGuest.id); setPreviewGuest(null) }}
        />
      )}
    </div>
  )
}

function TabBtn({ active, onClick, icon, label, count, live }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
      {label}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
      )}
      {live && (
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      )}
    </button>
  )
}
