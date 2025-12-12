import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const location = useLocation()
  const active = location.pathname

  const linkClass = (path) =>
    `hover:opacity-80 transition ${
      active === path ? 'font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 pb-1' : ''
    }`

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50"
    >
      <div className="glass shadow-glass border-b border-white/20 dark:border-white/10">
        <nav className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="text-xl font-extrabold tracking-tight grad-text">AskDB</a>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={linkClass("/")}>Home</Link>
            <Link to="/business" className={linkClass("/business")}>Business</Link>
            <Link to="/local" className={linkClass("/local")}>Local</Link>
            <Link to="/about" className={linkClass("/about")}>About</Link>
          </div>

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-2xl p-2 border border-white/20 dark:border-white/10 hover:scale-105 transition glass"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </motion.header>
  )
}
