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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)' }}>
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-red-900/40 border border-red-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-display text-white text-2xl font-bold mb-2">Invalid Invitation</h1>
          <p className="text-slate-400 text-sm">This QR code is not recognized.</p>
        </div>
      </div>
    )
  }

  const familyMembers = guest.familyMembers || []
  const kids = guest.kids || []
  const totalPax = 1 + (familyMembers.length || guest.familyCount || 0) + kids.length
  const eventDate = guest.eventDate
    ? new Date(guest.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Saturday, July 4, 2026'

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      <div className={`max-w-sm mx-auto px-4 py-10 flex flex-col min-h-screen transition-all duration-500 ${scanned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Verified badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-emerald-300 text-xs font-semibold tracking-wide">INVITATION VERIFIED</span>
          </div>
        </div>

        {/* Event header */}
        <div className="text-center mb-7">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.5))' }} />
            <span style={{ color: '#f59e0b', fontSize: '18px' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.5))' }} />
          </div>
          <p className="text-amber-400/80 text-xs font-semibold uppercase tracking-widest mb-2">You are welcomed to</p>
          <h1 className="font-display text-white text-3xl font-bold leading-tight mb-2">
            {guest.eventName}
          </h1>
          <p className="text-slate-400 text-sm">{eventDate}</p>
          <div className="flex items-center gap-3 justify-center mt-4">
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.5))' }} />
            <span style={{ color: '#f59e0b', fontSize: '18px' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.5))' }} />
          </div>
        </div>

        {/* Guest card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden mb-5">
          <div style={{ height: '3px', background: 'linear-gradient(to right, #f59e0b, #fcd34d, #f59e0b)' }} />

          <div className="p-6">
            {/* Guest name */}
            <div className="text-center mb-6">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-1.5">Dear</p>
              <h2 className="font-display text-white text-2xl font-bold">{guest.name}</h2>
              {guest.title && <p className="text-amber-400/70 text-sm italic mt-0.5">{guest.title}</p>}
            </div>

            {/* Pax */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total Attendees</p>
                  <p className="font-display text-white text-3xl font-bold">
                    {totalPax}
                    <span className="text-slate-400 text-sm font-normal ml-2">{totalPax === 1 ? 'person' : 'persons'}</span>
                  </p>
                </div>
                <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              {(familyMembers.length > 0 || kids.length > 0) && (
                <div className="flex gap-3 mt-3 pt-3 border-t border-white/10 text-xs">
                  <span className="text-slate-400">1 guest</span>
                  {familyMembers.length > 0 && <span className="text-teal-400">+ {familyMembers.length} family</span>}
                  {kids.length > 0 && <span className="text-pink-400">+ {kids.length} kid{kids.length > 1 ? 's' : ''}</span>}
                </div>
              )}
            </div>

            {/* Family members */}
            {familyMembers.length > 0 && (
              <div className="mb-3">
                <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-2">Family Members</p>
                <div className="flex flex-wrap gap-1.5">
                  {familyMembers.map((m, i) => (
                    <span key={i} className="bg-teal-900/40 border border-teal-700/50 text-teal-300 text-xs font-medium px-3 py-1 rounded-full">
                      👤 {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Kids */}
            {kids.length > 0 && (
              <div className="mb-3">
                <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-2">Kids</p>
                <div className="flex flex-wrap gap-1.5">
                  {kids.map((k, i) => (
                    <span key={i} className="bg-pink-900/40 border border-pink-700/50 text-pink-300 text-xs font-medium px-3 py-1 rounded-full">
                      🎂 {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {guest.notes && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3">
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">Note</p>
                <p className="text-amber-200/80 text-sm">{guest.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-auto pt-4">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div style={{ flex: 1, height: '1px', background: 'rgba(251,191,36,0.2)' }} />
            <span style={{ color: 'rgba(251,191,36,0.4)', fontSize: '10px' }}>✦</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(251,191,36,0.2)' }} />
          </div>
          <p className="text-slate-500 text-xs">Please present this screen at the venue entrance</p>
          <p className="text-slate-700 text-xs mt-1">Ref: {guest.id}</p>
        </div>
      </div>
    </div>
  )
}
