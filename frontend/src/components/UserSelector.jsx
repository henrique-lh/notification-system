import React, { useState } from 'react'

export default function UserSelector({ users, selected, onAdd, onSelect }) {
  const [value, setValue] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    onAdd(v)
    setValue('')
    onSelect(v)
  }

  return (
    <div className="card-soft p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700">Usuário</label>
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 px-3 py-2 bg-white"
          style={{ borderColor: 'rgba(15,23,42,0.06)' }}
        >
          {users.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 w-full sm:w-auto">
        <input
          placeholder="novo user id"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 w-full sm:w-56"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:opacity-95 transition"
          style={{ background: 'linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 100%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar
        </button>
      </form>
    </div>
  )
}
