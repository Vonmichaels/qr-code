import { QRCodeSVG } from 'qrcode.react'
import { encodeGuest } from '../utils/storage.js'

export default function GuestCard({ guest, onEdit, onDelete, onPreview }) {
  const guestUrl = `${window.location.origin}${window.location.pathname}?guest=${encodeGuest(guest)}`
  const kids = guest.kids || []
  const totalPax = 1 + (guest.familyCount || 0) + kids.length

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{guest.name}</h3>
            {guest.title && <p className="text-xs text-gray-400 mt-0.5">{guest.title}</p>}
            {kids.length > 0 && (
              <p className="text-xs text-pink-400 mt-0.5">
                🎂 {kids.join(', ')}
              </p>
            )}
          </div>
          <div className="shrink-0 bg-gray-50 border border-gray-100 rounded-xl p-2 cursor-pointer" onClick={onPreview}>
            <QRCodeSVG value={guestUrl} size={64} level="M" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {totalPax} pax
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            July 4, 2026
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPreview}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Invite
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1.5 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1.5 text-xs font-medium bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
