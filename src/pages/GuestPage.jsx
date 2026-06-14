import { useEffect, useState } from 'react'
import { logScan } from '../utils/supabase.js'

export default function GuestPage({ guest }) {
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (guest) logScan(guest)
    setTimeout(() => setScanned(true), 200)
  }, [])

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Invitation</h1>
          <p className="text-gray-500">This QR code is not recognized.</p>
        </div>
      </div>
    )
  }

  const familyMembers = guest.familyMembers || []
  const kids = guest.kids || []
  const totalPax = 1 + (familyMembers.length || guest.familyCount || 0) + kids.length
  const eventDate = guest.eventDate
    ? new Date(guest.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md transition-all duration-500 ${scanned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Verified badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Verified Guest
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

          <div className="p-6">
            {/* Event */}
            {guest.eventName && (
              <p className="text-center text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-1">
                {guest.eventName}
              </p>
            )}
            {eventDate && (
              <p className="text-center text-gray-400 text-xs mb-5">{eventDate}</p>
            )}

            {/* Guest name */}
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-indigo-600">
                  {guest.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{guest.name}</h1>
              {guest.title && <p className="text-gray-500 text-sm mt-1">{guest.title}</p>}
            </div>

            {/* Total Pax */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">Total Pax</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {totalPax} <span className="text-sm font-medium">{totalPax === 1 ? 'person' : 'persons'}</span>
                </p>
                <div className="flex gap-2 mt-0.5">
                  {familyMembers.length > 0 && (
                    <span className="text-xs text-teal-500">{familyMembers.length} family</span>
                  )}
                  {familyMembers.length > 0 && kids.length > 0 && (
                    <span className="text-xs text-gray-300">·</span>
                  )}
                  {kids.length > 0 && (
                    <span className="text-xs text-pink-400">{kids.length} kid{kids.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Family members list */}
            {familyMembers.length > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-3">
                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-2">Family Members</p>
                <div className="flex flex-wrap gap-2">
                  {familyMembers.map((member, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white border border-teal-200 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      👤 {member}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Kids list */}
            {kids.length > 0 && (
              <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 mb-3">
                <p className="text-xs text-pink-500 font-semibold uppercase tracking-wide mb-2">Kids Attending</p>
                <div className="flex flex-wrap gap-2">
                  {kids.map((kid, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white border border-pink-200 text-pink-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      🎂 {kid}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {guest.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-semibold mb-1">Note</p>
                <p className="text-sm text-amber-800">{guest.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">ID: {guest.id}</span>
            <span className="text-xs text-emerald-600 font-medium">✓ Valid Invitation</span>
          </div>
        </div>
      </div>
    </div>
  )
}
