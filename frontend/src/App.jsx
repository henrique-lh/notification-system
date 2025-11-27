import React, { useEffect, useState } from 'react'
import UserSelector from './components/UserSelector'
import NotificationList from './components/NotificationList'
import CreateNotificationModal from './components/CreateNotificationModal'

const DEFAULT_USERS = ['user456']

export default function App() {
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('ns_users')
      return raw ? JSON.parse(raw) : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  })

  const [selectedUser, setSelectedUser] = useState(() => {
    try {
      return localStorage.getItem('ns_selected_user') || users[0]
    } catch {
      return users[0]
    }
  })

  useEffect(() => {
    localStorage.setItem('ns_users', JSON.stringify(users))
    if (!users.includes(selectedUser)) setSelectedUser(users[0])
  }, [users])

  useEffect(() => {
    if (selectedUser) localStorage.setItem('ns_selected_user', selectedUser)
  }, [selectedUser])

  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 card-soft p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Notifications Viewer</h1>
            <p className="text-sm text-gray-600 mt-1">Selecione um usuário para ver suas notificações</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Usuários: <span className="font-medium text-gray-700">{users.length}</span></div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white hover:opacity-95 transition"
              style={{ background: 'linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 100%)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova notificação
            </button>
          </div>
        </header>

        <div className="mb-4">
          <UserSelector
            users={users}
            selected={selectedUser}
            onAdd={(u) => setUsers((s) => (s.includes(u) ? s : [...s, u]))}
            onSelect={(u) => setSelectedUser(u)}
          />
        </div>

        <main className="mt-2">
          {selectedUser ? (
            <NotificationList userId={selectedUser} refreshKey={refreshKey} />
          ) : (
            <div className="text-center text-gray-500">Nenhum usuário selecionado</div>
          )}
        </main>

        <CreateNotificationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={selectedUser}
          onCreated={() => {
            // signal child to refetch
            setRefreshKey((k) => k + 1)
          }}
        />
      </div>
    </div>
  )
}
