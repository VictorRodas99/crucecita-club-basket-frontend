import { createContext, PropsWithChildren, useMemo } from 'react'
import { useSecureStorageState } from '../hooks/use-secure-storage'

export type Session = {
  accessToken: string
  forgotPasswordToken?: string
}

interface SessionContext {
  setSession: (session: Session | null) => void
  session?: Session | null
  isLoading: boolean
}

export const AuthContext = createContext<SessionContext>({
  setSession: () => {},
  session: null,
  isLoading: false
})

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] =
    useSecureStorageState<Session>('session')

  const value = useMemo(
    () => ({
      setSession,
      session,
      isLoading
    }),
    [setSession, session, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
