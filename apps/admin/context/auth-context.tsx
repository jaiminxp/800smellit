'use client'

import { userService, authService } from '@/services'
import { ICurrentUser, IMeResponse } from '@/lib/interfaces'
import { useRouter } from 'next/navigation'
import { createContext, useReducer, ReactNode, Reducer, Dispatch } from 'react'
import { useQuery } from '@tanstack/react-query'

type IAuthState = ICurrentUser | null

type IAuthAction =
  | {
      type: string
      payload: ICurrentUser
    }
  | { type: 'delete' }

export const AuthContext = createContext<IAuthState>(null)

export const AuthDispatchContext = createContext<Dispatch<IAuthAction> | null>(
  null
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, dispatch] = useReducer<Reducer<IAuthState, IAuthAction>>(
    authReducer,
    null
  )

  const router = useRouter()

  const {
    data: me,
    error,
    refetch: getMe,
  } = useQuery<IMeResponse, Error>(['me'], () => userService.me(), {
    retry: false,
    enabled: false,
  })

  if (authService.isLoggedIn() && !auth) {
    getMe()
  }

  if (me && !auth && !error) {
    dispatch({ type: 'set', payload: me.user })
  }

  if (error) {
    if (auth) {
      dispatch({ type: 'delete' })
    }

    authService.logout()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

function authReducer(state: IAuthState, action: IAuthAction) {
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
  return state
}
