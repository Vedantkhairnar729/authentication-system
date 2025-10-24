import { useAuth } from '../hooks/useAuth.tsx'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      <div style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px' 
      }}>
        <h2>Welcome, {user?.username}!</h2>
        <p style={{ marginTop: '1rem' }}>Email: {user?.email}</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9em', opacity: 0.7 }}>
          User ID: {user?.id}
        </p>
      </div>
      <button 
        onClick={logout} 
        style={{ marginTop: '2rem', backgroundColor: '#dc3545' }}
      >
        Logout
      </button>
    </div>
  )
}
