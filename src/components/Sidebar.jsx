import styles from './Sidebar.module.css'
import Logo from './Logo'
import AppNavBar from './AppNavBar'
import { Outlet } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Logo />
      <AppNavBar />
      <Outlet />
      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWise
        </p>
      </footer>
    </aside>
  )
}

export default Sidebar
