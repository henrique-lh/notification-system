import React, { useEffect, useState } from 'react'

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function NotificationList({ userId, refreshKey }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState({ data: [], total: 0, page: 1, pageSize: 20 })
  const [processingIds, setProcessingIds] = useState({})

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`http://localhost:8888/api/notifications/user/${encodeURIComponent(userId)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Erro ao buscar notificações')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId, refreshKey])


  // mark a notification as read. Once read, the UI will disable the button
  async function markAsRead(id, currentRead) {
    if (currentRead) return // already read; backend does not allow toggling back
    setProcessingIds((s) => ({ ...s, [id]: true }))
    try {
      const res = await fetch(`http://localhost:8888/api/notifications/${encodeURIComponent(id)}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const updated = json && json._id ? json : json?.data || json
      if (updated && updated._id) {
        setData((prev) => ({
          ...prev,
          data: prev.data.map((it) => (it._id === updated._id ? updated : it))
        }))
      } else {
        // fallback: optimistic update to mark as read
        setData((prev) => ({
          ...prev,
          data: prev.data.map((it) => (it._id === id ? { ...it, read: true } : it))
        }))
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar leitura: ' + (err.message || ''))
    } finally {
      setProcessingIds((s) => {
        const copy = { ...s }
        delete copy[id]
        return copy
      })
    }
  }

  async function deleteNotification(id) {
    if (!confirm('Deletar notificação?')) return
    setProcessingIds((s) => ({ ...s, [id]: true }))
    try {
      const res = await fetch(`http://localhost:8888/api/notifications/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // assume success
      setData((prev) => ({ ...prev, data: prev.data.filter((it) => it._id !== id), total: Math.max(0, (prev.total || 1) - 1) }))
    } catch (err) {
      console.error(err)
      alert('Erro ao deletar: ' + (err.message || ''))
    } finally {
      setProcessingIds((s) => {
        const copy = { ...s }
        delete copy[id]
        return copy
      })
    }
  }

  return (
    <div className="card-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Notificações — {userId}</h2>
        <div className="text-sm text-gray-500">Total: <span className="font-medium text-gray-700">{data?.total ?? 0}</span></div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Erro: {error}</div>
      ) : data?.data?.length ? (
        <ul className="space-y-4">
          {data.data.map((n) => (
            <li key={n._id} className="p-4 border border-gray-100 rounded-lg hover:shadow transition bg-white">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${n.read ? 'bg-gray-300' : 'bg-yellow-400'}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-800">{n.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                    </div>
                    <div className="text-xs text-gray-400">{formatDate(n.createdAt)}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">Status: {n.read ? 'Lida' : 'Não lida'}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markAsRead(n._id, n.read)}
                        disabled={!!processingIds[n._id] || n.read}
                        className={`px-3 py-1 text-sm rounded-md ${n.read ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white'}`}
                        style={!n.read ? { background: 'linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 100%)' } : undefined}
                      >
                        {processingIds[n._id] ? '...' : n.read ? 'Lida' : 'Marcar lida'}
                      </button>

                      <button
                        onClick={() => deleteNotification(n._id)}
                        disabled={!!processingIds[n._id]}
                        className="px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                        style={{ borderColor: 'rgba(239,68,68,0.12)' }}
                      >
                        {processingIds[n._id] ? '...' : 'Deletar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-500">Nenhuma notificação</div>
      )}

      {/* modal moved to App; creation triggers a refresh via refreshKey prop */}
    </div>
  )
}
