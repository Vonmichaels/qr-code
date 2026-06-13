import { useState } from 'react'
import { saveGuest, generateId } from '../utils/storage.js'

const EVENT_NAME = "9th Birthday of Brando"
const EVENT_DATE = "2026-07-04"

const DEFAULTS = {
  name: '',
  title: '',
  familyCount: 0,
  notes: '',
}

export default function GuestForm({ existing, onClose }) {
  const [form, setForm] = useState(existing ? { ...existing } : { ...DEFAULTS })
  const [errors, setErrors] = useState({})

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Guest name is required'
    if (form.familyCount < 0) errs.familyCount = 'Cannot be negative'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    saveGuest({
      ...form,
      id: existing?.id || generateId(),
      familyCount: Number(form.familyCount),
      eventName: EVENT_NAME,
      eventDate: EVENT_DATE,
      createdAt: existing?.createdAt || new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {existing ? 'Edit Guest' : 'New Guest Invitation'}
            </h2>
            <p className="text-xs text-indigo-500 font-medium mt-0.5">{EVENT_NAME}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Guest Information</p>
            <div className="space-y-3">
              <Field label="Guest Full Name *" error={errors.name}>
                <input
                  className={input(errors.name)}
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Juan dela Cruz"
                  autoFocus
                />
              </Field>

              <Field label="Title / Relation" error={errors.title}>
                <input
                  className={input(errors.title)}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Classmate, Tita, Ninong..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Additional Family Members" error={errors.familyCount}>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    className={input(errors.familyCount)}
                    value={form.familyCount}
                    onChange={e => set('familyCount', e.target.value)}
                  />
                </Field>
                <div className="bg-indigo-50 rounded-xl px-4 py-2 flex flex-col justify-center">
                  <span className="text-xs text-indigo-500 font-medium">Total Pax</span>
                  <span className="text-xl font-bold text-indigo-700">{1 + Number(form.familyCount || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <Field label="Special Notes">
            <textarea
              className={`${input()} resize-none`}
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Vegetarian, wheelchair access, VIP..."
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors">
              {existing ? 'Save Changes' : 'Generate Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function input(error) {
  return `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${
    error
      ? 'border-red-300 focus:border-red-400 bg-red-50'
      : 'border-gray-200 focus:border-indigo-400 bg-gray-50 focus:bg-white'
  }`
}
