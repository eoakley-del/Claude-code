import { useAuthUser } from './hooks/useAuthUser'
import { PinGate } from './components/PinGate'
import App from './App.jsx'

export function Root() {
  const user = useAuthUser()

  if (user === undefined) {
    return (
      <div className="page">
        <p className="loading-state">Loading…</p>
      </div>
    )
  }

  if (user === null) {
    return <PinGate />
  }

  return <App uid={user.uid} />
}
