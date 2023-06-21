import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import styles from './Login.module.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('jack@example.com')
  const [password, setPassword] = useState('qwerty')
  const navigate = useNavigate()
  const { login, isLoggedIn } = useAuth()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return
    login(email, password)
  }

  useEffect(() => {
    if (isLoggedIn) navigate('/app', { replace: true })
  }, [isLoggedIn])

  return (
    <main className={styles.login}>
      <NavBar />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  )
}
