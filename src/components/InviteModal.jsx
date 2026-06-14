import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { encodeGuest } from '../utils/storage.js'

export default function InviteModal({ guest, onClose, onDelete }) {
  const cardRef = useRef(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const guestUrl = `${window.location.origin}${window.location.pathname}?guest=${encodeGuest(guest)}`
  const familyMembers = guest.familyMembers || []
  const kids = guest.kids || []
  const totalPax = 1 + (familyMembers.length || guest.familyCount || 0) + kids.length

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

  const eventDate = guest.eventDate
    ? new Date(guest.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto border border-slate-100">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-slate-800">Guest Invitation</h2>
            <p className="text-xs text-slate-400 mt-0.5">Preview & share</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Invite card */}
        <div className="p-5">
          <div id="print-area" ref={cardRef}
            className="bg-white overflow-hidden rounded-xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", border: '1.5px solid #e2e8f0' }}>

            {/* Header band */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)', padding: '28px 28px 20px', textAlign: 'center' }}>
              {/* Gold decorative line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
              </div>
              <p style={{ color: 'rgba(251,191,36,0.8)', fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>
                You are cordially invited to
              </p>
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 6px', lineHeight: '1.2' }}>
                {guest.eventName}
              </h2>
              {eventDate && (
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: '400', margin: 0 }}>
                  {eventDate}
                </p>
              )}
              {/* Gold decorative line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
              </div>
            </div>

            {/* QR section */}
            <div style={{ padding: '24px 28px 0', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                <QRCodeSVG value={guestUrl} size={150} level="H" includeMargin={false} />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '10px', fontFamily: "'Inter', sans-serif", marginTop: '8px', letterSpacing: '0.05em' }}>
                Present this QR code at the venue entrance
              </p>
            </div>

            {/* Guest details */}
            <div style={{ padding: '20px 28px 24px' }}>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
                <span style={{ color: '#cbd5e1', fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Guest Details</span>
                <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
              </div>

              {/* Name */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: '#0f172a', fontSize: '22px', fontWeight: '700', margin: '0 0 2px' }}>{guest.name}</h3>
                {guest.title && <p style={{ color: '#94a3b8', fontSize: '11px', fontFamily: "'Inter', sans-serif", fontStyle: 'italic', margin: 0 }}>{guest.title}</p>}
              </div>

              {/* Total Pax */}
              <div style={{ background: '#0f172a', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p style={{ color: '#f59e0b', fontSize: '9px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1px' }}>Total Pax</p>
                  <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                    {totalPax} <span style={{ fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: '400', color: '#94a3b8' }}>{totalPax === 1 ? 'person' : 'persons'}</span>
                  </p>
                </div>
                {(familyMembers.length > 0 || kids.length > 0) && (
                  <p style={{ marginLeft: 'auto', color: '#64748b', fontSize: '10px', fontFamily: "'Inter', sans-serif", textAlign: 'right' }}>
                    {familyMembers.length > 0 && <span style={{ display: 'block', color: '#5eead4' }}>{familyMembers.length} family</span>}
                    {kids.length > 0 && <span style={{ display: 'block', color: '#f9a8d4' }}>{kids.length} kid{kids.length > 1 ? 's' : ''}</span>}
                  </p>
                )}
              </div>

              {/* Family members */}
              {familyMembers.length > 0 && (
                <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                  <p style={{ color: '#0d9488', fontSize: '9px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Family Members</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {familyMembers.map((m, i) => (
                      <span key={i} style={{ background: '#fff', border: '1px solid #99f6e4', color: '#0f766e', fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>👤 {m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Kids */}
              {kids.length > 0 && (
                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                  <p style={{ color: '#db2777', fontSize: '9px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Kids Attending</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {kids.map((k, i) => (
                      <span key={i} style={{ background: '#fff', border: '1px solid #fbcfe8', color: '#be185d', fontSize: '11px', fontFamily: "'Inter', sans-serif", fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>🎂 {k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {guest.notes && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px' }}>
                  <p style={{ color: '#92400e', fontSize: '9px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Note</p>
                  <p style={{ color: '#78350f', fontSize: '11px', fontFamily: "'Inter', sans-serif", margin: 0 }}>{guest.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9', padding: '10px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#cbd5e1', fontSize: '9px', fontFamily: "'Inter', sans-serif" }}>ID: {guest.id}</span>
              <span style={{ color: '#f59e0b', fontSize: '9px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Official Invitation</span>
            </div>
          </div>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="mx-5 mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-1">Remove this invitation?</p>
            <p className="text-xs text-red-400 mb-3">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={onDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
                Yes, Remove
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pb-5 grid grid-cols-4 gap-2">
          {[
            { label: 'Download', color: 'bg-slate-900 hover:bg-slate-800 text-white', onClick: handleDownload,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /> },
            { label: 'Copy Link', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700', onClick: handleCopyLink,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /> },
            { label: 'Print', color: 'bg-slate-50 hover:bg-slate-100 text-slate-700', onClick: () => window.print(),
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /> },
            { label: 'Delete', color: 'bg-red-50 hover:bg-red-100 text-red-500', onClick: () => setConfirmDelete(true),
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /> },
          ].map(({ label, color, onClick, icon }) => (
            <button key={label} onClick={onClick}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors text-xs font-semibold ${color}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
