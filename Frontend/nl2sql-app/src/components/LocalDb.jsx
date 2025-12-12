import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCopy, Check, PlayCircle, Link, Database, XCircle, CheckCircle } from 'lucide-react'

export default function LocalDb() {
  const [stage, setStage] = useState('connect')
  const [dbForm, setDbForm] = useState({
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [nlQuery, setNlQuery] = useState('')
  const [sql, setSql] = useState('')
  const [rows, setRows] = useState([])
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedType, setSelectedType] = useState('select') // ✅ query type

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2500)
  }

  const onChange = (e) => setDbForm({ ...dbForm, [e.target.name]: e.target.value })

  const connectDb = async () => {
    if (!dbForm.database.trim() || !dbForm.username.trim()) {
      showToast('error', 'Please fill all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbType: 'mysql', ...dbForm })
      })
      const data = await res.json()
      if (data.success) {
        setStage('query')
        showToast('success', 'Database connected successfully!')
      } else {
        showToast('error', `Connection failed: ${data.message}`)
      }
    } catch (err) {
      showToast('error', `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Updated: sends db info + queryType to backend
  const convertAndExecute = async () => {
    if (!nlQuery.trim()) return showToast('error', 'Enter a natural language query!')

    setLoading(true)
    try {
      // Translate request
      const translateRes = await fetch('http://localhost:8080/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: nlQuery,
          dialect: 'MYSQL',
          queryType: selectedType,
          ...dbForm
        })
      })

      const translateData = await translateRes.json()
      const sqlQuery = translateData.sql
      if (!sqlQuery) {
        showToast('error', 'Failed to generate SQL query!')
        setLoading(false)
        return
      }

      setSql(sqlQuery)

      // ✅ FIXED: include queryType in execute call
      const execRes = await fetch('http://localhost:8080/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dbForm,
          sql: sqlQuery,
          queryType: selectedType
        })
      })

      const execData = await execRes.json()
      if (execData.success) {
        setRows(execData.rows || [])
        showToast('success', 'Query executed successfully!')
      } else {
        showToast('error', execData.message || 'Execution failed.')
      }
    } catch (err) {
      showToast('error', `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copySQL = async () => {
    if (!sql) return
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    showToast('success', 'SQL copied to clipboard!')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      {/* Animated heading */}
      <div className="mx-auto max-w-7xl px-4 pt-16 md:pt-20 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-center"
        >
          Your <span className="grad-text">Business</span> Questions, <span className="grad-text">Answered By</span> Your Database
        </motion.h1>
      </div>

      <section className="relative min-h-screen flex items-center justify-center pt-4 px-4" style={{ marginTop: "-100px" }}>
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-3xl shadow-lg backdrop-blur-lg
              ${toast.type === 'success' ? 'bg-green-500/95 text-white' : toast.type === 'error' ? 'bg-red-500/95 text-white' : 'bg-indigo-500/95 text-white'}
            `}
            >
              {toast.type === 'success' && <CheckCircle className="h-6 w-6" />}
              {toast.type === 'error' && <XCircle className="h-6 w-6" />}
              <span className="font-medium">{toast.message}</span>
            </motion.div>
          </div>
        )}

        {/* CONNECT STAGE */}
        {stage === 'connect' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass w-full max-w-md rounded-3xl border border-white/30 shadow-glass p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-700 dark:text-slate-200 flex items-center gap-2 justify-center">
              <Database className="h-6 w-6 text-indigo-500" /> Connect to MySQL
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {['host', 'port', 'database', 'username', 'password'].map((field) => (
                <input
                  key={field}
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  placeholder={field === 'database' ? 'Database Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={dbForm[field]}
                  onChange={onChange}
                  className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60
                    bg-white/70 dark:bg-slate-900/50 p-3 outline-none focus:ring-2 focus:ring-indigo-400"
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={connectDb}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <Link className="h-5 w-5" /> Connect
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* QUERY STAGE */}
        {stage === 'query' && (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* LEFT PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl border border-white/30 shadow-glass p-6 md:p-8"
            >
              <div className="flex justify-center gap-3 mb-4">
                {['select', 'insert', 'update', 'delete', 'create', 'alter', 'drop'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition ${
                      selectedType === type
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>

              <label className="block text-xl font-semibold mb-2 text-slate-700 dark:text-slate-200">
                Natural Language Query
              </label>
              <textarea
                rows={8}
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="e.g., Show all employees from Pune"
                className="w-full resize-none rounded-2xl border border-slate-200/60 dark:border-slate-700/60
                  bg-white/70 dark:bg-slate-900/50 p-4 outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex justify-center mt-4">
                <button
                  onClick={convertAndExecute}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-3xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500
                    hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-5 w-5" /> Convert & Execute
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-6">
              {/* SQL Output */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5 }}
                className="glass rounded-3xl border border-white/30 shadow-glass p-6 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xl font-semibold text-slate-700 dark:text-slate-200">
                    SQL Output
                  </label>
                  <button
                    onClick={copySQL}
                    className="inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 border border-white/20 dark:border-white/10 glass hover:scale-105 transition"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                    <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="mt-3 flex-1 overflow-auto rounded-2xl p-4 font-mono text-sm
                  bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60">
                  {sql || '-- SQL will appear here'}
                </pre>
              </motion.div>

              {/* Query Results */}
              {rows.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="glass rounded-3xl border border-white/30 shadow-glass p-6 flex flex-col"
                >
                  <h3 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Query Results</h3>
                  <div className="overflow-auto max-h-96 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <table className="min-w-full text-sm border-collapse">
                      <thead className="bg-indigo-100 dark:bg-indigo-800 sticky top-0">
                        <tr>
                          {Object.keys(rows[0]).map((col) => (
                            <th key={col} className="border-b px-3 py-2 text-left text-slate-800 dark:text-slate-100 font-medium">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white/50 dark:bg-slate-800' : 'bg-white/30 dark:bg-slate-700'}>
                            {Object.keys(r).map((c) => (
                              <td key={c} className="border-b px-3 py-2 text-slate-700 dark:text-slate-200">{r[c]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}
