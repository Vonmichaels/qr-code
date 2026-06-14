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

    // Real-time: new scan appears instantly
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
    <div className="p-6 max-w-3xl mx-auto">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">Guests Arrived</p>
          <p className="text-3xl font-bold text-indigo-700">{uniqueGuests}</p>
          <p className="text-xs text-indigo-400 mt-1">unique QR scans</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Total People</p>
          <p className="text-3xl font-bold text-emerald-700">{totalPax}</p>
          <p className="text-xs text-emerald-400 mt-1">guests + family + kids</p>
        </div>
      </div>

      {/* Live feed */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Live Check-in Feed</h2>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No guests have arrived yet</p>
          <p className="text-gray-300 text-xs mt-1">Scans will appear here in real time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={log.id} className={`bg-white border rounded-xl p-4 flex items-start gap-4 shadow-sm ${i === 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                {log.guest_name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{log.guest_name}</p>
                    {log.title && <p className="text-xs text-gray-400">{log.title}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{formatTime(log.scanned_at)}</p>
                    <p className="text-xs text-gray-400">{formatDate(log.scanned_at)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Pax badge */}
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {log.total_pax} pax
                  </span>

                  {/* Family members */}
                  {log.family_members?.length > 0 && log.family_members.map((m, j) => (
                    <span key={j} className="text-xs bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      👤 {m}
                    </span>
                  ))}

                  {/* Kids */}
                  {log.kids?.length > 0 && log.kids.map((k, j) => (
                    <span key={j} className="text-xs bg-pink-50 border border-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                      🎂 {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
