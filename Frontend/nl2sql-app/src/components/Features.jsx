import { motion } from 'framer-motion'
import { Zap, Database, Bot, Gift } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Fast Conversion',
    desc: 'Blazing-fast translation from text to SQL with smooth UX.',
  },
  {
    icon: Database,
    title: 'Multiple Databases',
    desc: 'Target SQL flavors like Postgres, MySQL, SQLite (concept-ready).',
  },
  {
    icon: Bot,
    title: 'AI Powered',
    desc: 'Leverages cutting-edge LLMs to understand your intent.',
  },
  {
    icon: Gift,
    title: 'Free to Try',
    desc: 'Test the converter and explore the API at no cost.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-extrabold"
        >
          Features 
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group glass rounded-3xl border border-white/30 dark:border-white/10 p-5 shadow-glass
                         hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl p-3 bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-white/10">
                  <f.icon className="h-6 w-6 animate-pulse group-hover:animate-none" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
