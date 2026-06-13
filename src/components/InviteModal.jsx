import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { encodeGuest } from '../utils/storage.js'

export default function InviteModal({ guest, onClose, onDelete }) {
  const cardRef = useRef(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const guestUrl = `${window.location.origin}${window.location.pathname}?guest=${encodeGuest(guest)}`
  const kids = guest.kids || []
  const totalPax = 1 + (guest.familyCount || 0) + kids.length

  async function handleDownload() {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#fff' })
    const link = document.createElement('a')
    link.download = `invite-${guest.name.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(guestUrl)
      .then(() => alert('Link copied! Share it with the guest.'))
      .catch(() => alert(guestUrl))
  }

  function handlePrint() {
    window.print()
  }

  const eventDate = guest.eventDate
    ? new Date(guest.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Guest Invitation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Printable invite card */}
        <div className="p-6">
          <div
            id="print-area"
            ref={cardRef}
            className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {/* Top decorative band */}
            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)', padding: '24px 24px 16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>
                You are cordially invited to
              </p>
              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px' }}>
                {guest.eventName}
              </h2>
              {eventDate && (
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: 0 }}>{eventDate}</p>
              )}
            </div>

            {/* Main content */}
            <div style={{ padding: '20px 24px' }}>
              {/* QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'inline-block' }}>
                  <QRCodeSVG value={guestUrl} size={160} level="H" includeMargin={false} />
                </div>
                <p style={{ color: '#94a3b8', fontSize: '10px', marginTop: '8px', textAlign: 'center' }}>
                  Scan to verify at the venue
                </p>
              </div>

              {/* Guest info */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    Guest
                  </p>
                  <h3 style={{ color: '#1e293b', fontSize: '20px', fontWeight: '800', margin: '0 0 2px' }}>
                    {guest.name}
                  </h3>
                  {guest.title && (
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{guest.title}</p>
                  )}
                </div>

                {/* Total Pax */}
                <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: '#6366f1', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1px' }}>Total Pax</p>
                    <p style={{ color: '#1e293b', fontSize: '18px', fontWeight: '800', margin: 0 }}>
                      {totalPax} <span style={{ fontSize: '12px', fontWeight: '500', color: '#6366f1' }}>{totalPax === 1 ? 'person' : 'persons'}</span>
                    </p>
                    {kids.length > 0 && (
                      <p style={{ color: '#f472b6', fontSize: '10px', margin: '2px 0 0' }}>includes {kids.length} kid{kids.length > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>

                {/* Kids list */}
                {kids.length > 0 && (
                  <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
                    <p style={{ color: '#db2777', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Kids Attending
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {kids.map((kid, i) => (
                        <span key={i} style={{ background: '#fff', border: '1px solid #fbcfe8', color: '#be185d', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>
                          🎂 {kid}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {guest.notes && (
                  <div style={{ marginTop: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '10px 12px' }}>
                    <p style={{ color: '#92400e', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      Notes
                    </p>
                    <p style={{ color: '#78350f', fontSize: '12px', margin: 0 }}>{guest.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#cbd5e1', fontSize: '10px' }}>ID: {guest.id}</span>
              <span style={{ color: '#6366f1', fontSize: '10px', fontWeight: '600' }}>Official Invitation</span>
            </div>
          </div>
        </div>

        {/* Confirm delete banner */}
        {confirmDelete && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-1">Delete this invitation?</p>
            <p className="text-xs text-red-500 mb-3">This cannot be undone. The QR code will stop working.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-6 pb-6 grid grid-cols-4 gap-2">
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 rounded-xl transition-colors text-xs font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PNG
          </button>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-xl transition-colors text-xs font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Link
          </button>
          <button
            onClick={handlePrint}
            className="flex flex-col items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl transition-colors text-xs font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex flex-col items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl transition-colors text-xs font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
