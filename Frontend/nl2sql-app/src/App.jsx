import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Converter from './components/Converter'
import Features from './components/Features'
import Footer from './components/Footer'
import GradientBG from './components/GradientBG'
import BusinessModelPage from './components/BusinessModelPage'
import LocalDb from './components/LocalDb'
import About from './components/About'


export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <Router>
      <div className="font-inter">
        <GradientBG />
        <Navbar theme={theme} setTheme={setTheme} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Converter />
                  <Features />
                </>
              }
            />
        <Route path="/business" element={<BusinessModelPage />} />
       <Route path="/local" element={<LocalDb />} />
       <Route path="/about" element={<About/>}/>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}
