import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase.js'

export default function CheckInPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchLogs() {
    const { data } = await supabase
      .from('scan_logs')
      .select('*')
      .order('scanned_at', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
    const channel = supabase
      .channel('scan_logs_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scan_logs' }, payload => {
        setLogs(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const totalPax = logs.reduce((sum, l) => sum + (l.total_pax || 0), 0)
  const uniqueGuests = new Set(logs.map(l => l.guest_id)).size

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }
  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-linear-to-r from-amber-400 to-amber-500" />
          <div className="p-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2">Guests Arrived</p>
            <p className="font-display text-slate-900 text-4xl font-bold">{uniqueGuests}</p>
            <p className="text-xs text-slate-400 mt-1.5">unique QR scans</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-linear-to-r from-emerald-400 to-teal-500" />
          <div className="p-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2">Total People</p>
            <p className="font-display text-slate-900 text-4xl font-bold">{totalPax}</p>
            <p className="text-xs text-slate-400 mt-1.5">guests + family + kids</p>
          </div>
        </div>
      </div>

      {/* Feed header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-800">Live Check-in Feed</h2>
          <p className="text-xs text-slate-400 mt-0.5">Updates in real time</p>
        </div>
        <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading check-ins...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
          </div>
          <h3 className="font-display text-slate-700 font-bold mb-1">No Guests Yet</h3>
          <p className="text-slate-400 text-sm">Scans will appear here in real time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={log.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${i === 0 ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-100'}`}>
              {i === 0 && <div className="h-0.5 bg-linear-to-r from-amber-400 to-amber-300" />}
              <div className="p-4 flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm ${i === 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {log.guest_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{log.guest_name}</p>
                      {log.title && <p className="text-xs text-slate-400 italic">{log.title}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-700">{formatTime(log.scanned_at)}</p>
                      <p className="text-xs text-slate-400">{formatDate(log.scanned_at)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {log.total_pax} pax
                    </span>
                    {log.family_members?.length > 0 && log.family_members.map((m, j) => (
                      <span key={j} className="text-xs bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded-full">👤 {m}</span>
                    ))}
                    {log.kids?.length > 0 && log.kids.map((k, j) => (
                      <span key={j} className="text-xs bg-pink-50 border border-pink-100 text-pink-700 px-2 py-0.5 rounded-full">🎂 {k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
