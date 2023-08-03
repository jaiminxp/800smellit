import { userService, authService } from '@/services'
import {
  createContext,
  useReducer,
  ReactNode,
  Reducer,
  Dispatch,
  useEffect,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { User } from '@/types'
import { AuthActionType } from '@/types/auth'

type AuthState = User | null

type AuthAction =
  | {
      type: AuthActionType.Set
      payload: User
    }
  | {
      type: AuthActionType.Delete
    }

export const AuthContext = createContext<AuthState>(null)

export const AuthDispatchContext = createContext<Dispatch<AuthAction> | null>(
  null
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer<Reducer<AuthState, AuthAction>>(
    authReducer,
    null
  )

  const { data: me, error } = useQuery<User, Error>(
    ['me'],
    () => userService.me(),
    {
      retry: false,
      enabled: !!authService.isLoggedIn(),
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    if (!me) return
    dispatch({ type: AuthActionType.Set, payload: me })
  }, [me])

  useEffect(() => {
    if (!error) return
    !!authService.isLoggedIn() && authService.logout()
    user && dispatch({ type: AuthActionType.Delete })
  }, [error, user])

  return (
    <AuthContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case 'set': {
      return {
        ...action.payload,
      }
    }

    case 'delete': {
      return null
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}
