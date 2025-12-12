import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
        >
          Convert <span className="grad-text">Natural Language</span> to <span className="grad-text">SQL</span> Instantly
        </motion.h1>
       

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 max-w-2xl text-base md:text-lg text-slate-600 dark:text-slate-300"
        >
          AI-powered query translation that turns plain English into production-ready SQL.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="#convert"
            className="inline-block ml- rounded-3xl px-6 py-3 font-semibold text-white bg-grad-accent
                       hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition hover:scale-[1.02]"
          >
            Try Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
