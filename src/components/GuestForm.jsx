import { useState } from 'react'
import { saveGuest, generateId } from '../utils/storage.js'

const EVENT_NAME = "7th Birthday of Brando"
const EVENT_DATE = "2026-07-04"

const DEFAULTS = { name: '', title: '', familyMembers: [], kids: [], notes: '' }

export default function GuestForm({ existing, onClose }) {
  const [form, setForm] = useState(
    existing
      ? { ...existing, familyMembers: existing.familyMembers || [], kids: existing.kids || [] }
      : { ...DEFAULTS }
  )
  const [errors, setErrors] = useState({})

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function addMember() { setForm(f => ({ ...f, familyMembers: [...f.familyMembers, ''] })) }
  function updateMember(i, v) { setForm(f => { const a = [...f.familyMembers]; a[i] = v; return { ...f, familyMembers: a } }) }
  function removeMember(i) { setForm(f => ({ ...f, familyMembers: f.familyMembers.filter((_, j) => j !== i) })) }

  function addKid() { setForm(f => ({ ...f, kids: [...f.kids, ''] })) }
  function updateKid(i, v) { setForm(f => { const a = [...f.kids]; a[i] = v; return { ...f, kids: a } }) }
  function removeKid(i) { setForm(f => ({ ...f, kids: f.kids.filter((_, j) => j !== i) })) }

  const totalPax = 1 + form.familyMembers.length + form.kids.length

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Guest name is required'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    saveGuest({
      ...form,
      id: existing?.id || generateId(),
      familyMembers: form.familyMembers.map(m => m.trim()).filter(Boolean),
      kids: form.kids.map(k => k.trim()).filter(Boolean),
      eventName: EVENT_NAME,
      eventDate: EVENT_DATE,
      createdAt: existing?.createdAt || new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-100">

        {/* Header */}
        <div className="bg-slate-900 rounded-t-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-white text-lg font-bold">
                {existing ? 'Edit Invitation' : 'New Invitation'}
              </h2>
              <p className="text-amber-400 text-xs font-medium tracking-wide mt-0.5">{EVENT_NAME}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">

          {/* Guest Information */}
          <Section label="Guest Information">
            <Field label="Full Name *" error={errors.name}>
              <input className={inp(errors.name)} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Juan dela Cruz" autoFocus />
            </Field>
            <Field label="Title / Relation">
              <input className={inp()} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Ninong, Tita, Classmate" />
            </Field>
          </Section>

          {/* Family Members */}
          <Section label="Family Members" sub="Adults accompanying the guest" color="teal"
            action={<AddBtn onClick={addMember} color="teal" label="Add Member" />}>
            {form.familyMembers.length === 0 ? (
              <EmptySlot onClick={addMember} color="teal" label="Add a family member's name" />
            ) : (
              <div className="space-y-2">
                {form.familyMembers.map((m, i) => (
                  <NameRow key={i} icon="👤" value={m} placeholder={`Member ${i + 1}`} color="teal"
                    onChange={v => updateMember(i, v)} onRemove={() => removeMember(i)} />
                ))}
              </div>
            )}
          </Section>

          {/* Kids */}
          <Section label="Kids Attending" sub="Each child is counted in total pax" color="pink"
            action={<AddBtn onClick={addKid} color="pink" label="Add Kid" />}>
            {form.kids.length === 0 ? (
              <EmptySlot onClick={addKid} color="pink" label="Add a kid's name" />
            ) : (
              <div className="space-y-2">
                {form.kids.map((k, i) => (
                  <NameRow key={i} icon="🎂" value={k} placeholder={`Kid ${i + 1}`} color="pink"
                    onChange={v => updateKid(i, v)} onRemove={() => removeKid(i)} />
                ))}
              </div>
            )}
          </Section>

          {/* Pax summary */}
          <div className="bg-slate-900 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Total Pax</p>
              <p className="font-display text-white text-2xl font-bold mt-0.5">{totalPax} <span className="text-sm font-normal text-slate-400">{totalPax === 1 ? 'person' : 'persons'}</span></p>
            </div>
            <div className="text-right text-xs text-slate-500 space-y-0.5">
              <p>1 guest</p>
              {form.familyMembers.length > 0 && <p className="text-teal-400">+ {form.familyMembers.length} family</p>}
              {form.kids.length > 0 && <p className="text-pink-400">+ {form.kids.length} kid{form.kids.length > 1 ? 's' : ''}</p>}
            </div>
          </div>

          {/* Notes */}
          <Field label="Special Notes">
            <textarea className={`${inp()} resize-none`} rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)} placeholder="Dietary needs, accessibility, VIP..." />
          </Field>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
              {existing ? 'Save Changes' : 'Generate Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Section({ label, sub, color = 'slate', action, children }) {
  const colors = {
    teal: 'text-teal-600',
    pink: 'text-pink-500',
    slate: 'text-slate-600',
  }
  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest ${colors[color]}`}>{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function AddBtn({ onClick, color, label }) {
  const cls = {
    teal: 'text-teal-600 bg-teal-50 hover:bg-teal-100',
    pink: 'text-pink-500 bg-pink-50 hover:bg-pink-100',
  }
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${cls[color]}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </button>
  )
}

function EmptySlot({ onClick, color, label }) {
  const cls = {
    teal: 'border-teal-200 text-teal-400 hover:border-teal-300',
    pink: 'border-pink-200 text-pink-400 hover:border-pink-300',
  }
  return (
    <button type="button" onClick={onClick}
      className={`w-full border-2 border-dashed rounded-xl py-3 text-xs transition-colors ${cls[color]}`}>
      + {label}
    </button>
  )
}

function NameRow({ icon, value, placeholder, color, onChange, onRemove }) {
  const cls = {
    teal: 'border-teal-200 focus:border-teal-400 bg-teal-50',
    pink: 'border-pink-200 focus:border-pink-400 bg-pink-50',
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-6 text-center shrink-0">{icon}</span>
      <input
        className={`flex-1 px-3 py-2 rounded-xl border focus:bg-white text-sm outline-none transition-colors ${cls[color]}`}
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={value === ''} />
      <button type="button" onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function inp(error) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
    error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white'
  }`
}
