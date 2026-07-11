'use client'

import { useState } from 'react'

type Props = {
  onAdd: (title: string, details: string) => void
}

export default function AddCardForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')

  return (
    <form
      className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!title.trim()) return
        onAdd(title.trim(), details.trim())
        setTitle('')
        setDetails('')
      }}
    >
      <label className="block text-sm font-semibold text-navy">New card</label>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Details"
        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        rows={3}
      />
      <button
        type="submit"
        className="mt-3 inline-flex items-center justify-center rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b2c82]"
      >
        Add card
      </button>
    </form>
  )
}
