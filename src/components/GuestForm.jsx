import { useState } from 'react'
import { saveGuest, generateId } from '../utils/storage.js'

const EVENT_NAME = "9th Birthday of Brando"
const EVENT_DATE = "2026-07-04"

const DEFAULTS = {
  name: '',
  title: '',
  familyCount: 0,
  kids: [],
  notes: '',
}

export default function GuestForm({ existing, onClose }) {
  const [form, setForm] = useState(existing ? { ...existing, kids: existing.kids || [] } : { ...DEFAULTS })
  const [errors, setErrors] = useState({})

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function addKid() {
    setForm(f => ({ ...f, kids: [...f.kids, ''] }))
  }

  function updateKid(index, value) {
    setForm(f => {
      const kids = [...f.kids]
      kids[index] = value
      return { ...f, kids }
    })
  }

  function removeKid(index) {
    setForm(f => ({ ...f, kids: f.kids.filter((_, i) => i !== index) }))
  }

  const totalPax = 1 + Number(form.familyCount || 0) + form.kids.length

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
      kids: form.kids.map(k => k.trim()).filter(Boolean),
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

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Guest info */}
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

              <Field label="Title / Relation">
                <input
                  className={input()}
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Classmate, Tita, Ninong..."
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Additional Adults" error={errors.familyCount}>
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
                  <span className="text-xl font-bold text-indigo-700">{totalPax}</span>
                  {form.kids.length > 0 && (
                    <span className="text-xs text-pink-400">{form.kids.length} kid{form.kids.length > 1 ? 's' : ''} included</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kids section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-pink-500 uppercase tracking-widest">Kids Attending</p>
              <button
                type="button"
                onClick={addKid}
                className="flex items-center gap-1 text-xs font-medium text-pink-500 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Kid
              </button>
            </div>

            {form.kids.length === 0 ? (
              <button
                type="button"
                onClick={addKid}
                className="w-full border-2 border-dashed border-pink-200 rounded-xl py-3 text-xs text-pink-400 hover:border-pink-300 hover:text-pink-500 transition-colors"
              >
                + Add a kid's name (they'll be counted in total pax)
              </button>
            ) : (
              <div className="space-y-2">
                {form.kids.map((kid, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs">🎂</span>
                    </div>
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-pink-200 focus:border-pink-400 bg-pink-50 focus:bg-white text-sm outline-none transition-colors"
                      value={kid}
                      onChange={e => updateKid(i, e.target.value)}
                      placeholder={`Kid ${i + 1} name`}
                      autoFocus={kid === ''}
                    />
                    <button
                      type="button"
                      onClick={() => removeKid(i)}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <Field label="Special Notes">
            <textarea
              className={`${input()} resize-none`}
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Vegetarian, wheelchair access, VIP..."
            />
          </Field>

          <div className="flex gap-3 pt-1">
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
