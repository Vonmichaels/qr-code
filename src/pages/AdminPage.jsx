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

  function refresh() { setGuests(getGuests()) }
  useEffect(() => { refresh() }, [])

  function handleDelete(id) {
    if (!confirm('Remove this guest invitation?')) return
    deleteGuest(id)
    refresh()
  }

  function handleEdit(guest) { setEditGuest(guest); setShowForm(true) }
  function handleFormClose() { setShowForm(false); setEditGuest(null); refresh() }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-slate-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-white text-lg font-bold leading-tight">Bran's 7th Birthday</h1>
              <p className="text-slate-400 text-xs font-medium tracking-widest uppercase mt-0.5">Invitation Management System</p>
            </div>
          </div>
          {tab === 'guests' && (
            <button
              onClick={() => { setEditGuest(null); setShowForm(true) }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Guest
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6 border-t border-slate-800">
          <div className="flex">
            <TabBtn active={tab === 'guests'} onClick={() => setTab('guests')}
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
              label="Guest List"
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'guests' ? (
          guests.length === 0 ? (
            <div className="text-center py-28">
              <div className="w-20 h-20 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-9 h-9 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">No Invitations Yet</h2>
              <p className="text-slate-400 mb-7 text-sm">Create your first guest invitation to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Create First Invitation
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-800">Guest List</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{guests.length} invitation{guests.length !== 1 ? 's' : ''} created</p>
                </div>
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
          )
        ) : (
          <CheckInPage />
        )}
      </main>

      {showForm && <GuestForm existing={editGuest} onClose={handleFormClose} />}
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
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
      {label}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${active ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
          {count}
        </span>
      )}
      {live && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
    </button>
  )
}
