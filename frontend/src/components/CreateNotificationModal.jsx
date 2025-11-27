import React, { useState } from 'react'

export default function CreateNotificationModal({ isOpen, onClose, userId, onCreated }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !message.trim()) {
      setError('Título e mensagem são obrigatórios')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8888/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title: title.trim(), message: message.trim() })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      onCreated && onCreated(json)
      setTitle('')
      setMessage('')
      onClose()
    } catch (err) {
      setError(err.message || 'Erro ao criar notificação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg rounded-lg shadow-lg bg-white">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Nova notificação</h3>
            <div className="text-sm text-gray-500">Para: <span className="font-medium text-gray-700">{userId || '—'}</span></div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Fechar</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mensagem</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 shadow-sm" />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 text-white">
              {loading ? 'Enviando...' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
