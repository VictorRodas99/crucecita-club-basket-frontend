import { useRouter } from 'expo-router'
import { GestureResponderEvent } from 'react-native'
import { toast } from 'sonner-native'
import { logout } from '../features/auth/use-auth-mutations'
import { useSession } from '../hooks/session'
import { Button, ButtonProps } from './primitives/button'

export default function LogoutButton({ children, ...props }: ButtonProps) {
  const { session, setSession } = useSession()
  const router = useRouter()

  const handleClick = (_event: GestureResponderEvent) => {
    if (!session) {
      return
    }

    logout({ token: session.accessToken })
      .then(() => {
        setSession(null)
        router.navigate('/(auth)/login')
      })
      .catch(() => toast.error('No se pudo cerrar sesion'))
  }

  return (
    <Button {...props} onPress={handleClick}>
      {children}
    </Button>
  )
}
