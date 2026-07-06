import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, PIN_ACCOUNT_EMAIL } from '../firebase'

const MIN_PIN_LENGTH = 6

function friendlyError(err, mode) {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return "A PIN is already set up on this account. Use 'Enter existing PIN' instead."
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return mode === 'login'
        ? "That PIN didn't work. If this is your first device, use 'Create a PIN' instead."
        : 'Something went wrong creating your PIN. Please try again.'
    case 'auth/weak-password':
      return `PIN must be at least ${MIN_PIN_LENGTH} digits.`
    default:
      return err.message
  }
}

export function PinGate() {
  const [mode, setMode] = useState('login')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setPin('')
    setConfirmPin('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (pin.length < MIN_PIN_LENGTH) {
      setError(`PIN must be at least ${MIN_PIN_LENGTH} digits.`)
      return
    }
    if (mode === 'create' && pin !== confirmPin) {
      setError("PINs don't match.")
      return
    }

    setBusy(true)
    try {
      if (mode === 'create') {
        await createUserWithEmailAndPassword(auth, PIN_ACCOUNT_EMAIL, pin)
      } else {
        await signInWithEmailAndPassword(auth, PIN_ACCOUNT_EMAIL, pin)
      }
    } catch (err) {
      setError(friendlyError(err, mode))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="pin-gate">
      <div className="pin-card">
        <h1>Task Manager</h1>
        <p className="pin-intro">
          {mode === 'create'
            ? 'Choose a PIN to protect your tasks. Use the same PIN to sign in on your other devices.'
            : 'Enter your PIN to sync your tasks across devices.'}
        </p>

        <form onSubmit={handleSubmit} className="pin-form">
          <input
            type="password"
            inputMode="numeric"
            placeholder="PIN (6+ digits)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            minLength={MIN_PIN_LENGTH}
            autoFocus
          />
          {mode === 'create' && (
            <input
              type="password"
              inputMode="numeric"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              minLength={MIN_PIN_LENGTH}
            />
          )}
          {error && <p className="pin-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy
              ? 'Please wait…'
              : mode === 'create'
                ? 'Create my PIN'
                : 'Unlock'}
          </button>
        </form>

        <button
          type="button"
          className="pin-toggle"
          onClick={() => switchMode(mode === 'create' ? 'login' : 'create')}
        >
          {mode === 'create'
            ? 'Already have a PIN from another device?'
            : "First time here? Create a PIN"}
        </button>
      </div>
    </div>
  )
}
