import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

const WRITE_DEBOUNCE_MS = 500

export function useCloudDoc(uid, defaults) {
  const [data, setData] = useState(defaults)
  const [ready, setReady] = useState(false)
  const pendingWrite = useRef(null)

  useEffect(() => {
    const ref = doc(db, 'users', uid)
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setData(snapshot.exists() ? { ...defaults, ...snapshot.data() } : defaults)
      setReady(true)
    })

    return () => {
      unsubscribe()
      clearTimeout(pendingWrite.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  function update(updaterOrValue) {
    setData((prev) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
      clearTimeout(pendingWrite.current)
      pendingWrite.current = setTimeout(() => {
        setDoc(doc(db, 'users', uid), next, { merge: true })
      }, WRITE_DEBOUNCE_MS)
      return next
    })
  }

  return { data, update, ready }
}
