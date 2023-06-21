import { createContext, useContext, useReducer } from 'react'

const AuthContext = createContext()

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isLoggedIn: true }
    case 'logout':
      return { ...state, user: null, isLoggedIn: false }
    default:
      throw new Error('Unknown action')
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
}

export function AuthProvider({ children }) {
  const [{ user, isLoggedIn }, dispatch] = useReducer(reducer, {
    user: null,
    isLoggedIn: false,
  })

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER })
    }
  }

  function logout() {
    dispatch({ type: 'logout' })
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('AuthContext used oustide provider')
  return context
}
