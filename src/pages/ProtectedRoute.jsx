import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate('/')
  }, [isLoggedIn])

  return isLoggedIn ? children : null
}

export default ProtectedRoute
