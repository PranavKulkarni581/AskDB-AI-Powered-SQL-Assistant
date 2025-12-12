import { motion } from 'framer-motion'

export default function GradientBG() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft radial glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[40rem] w-[40rem] rounded-full
                      blur-3xl opacity-40 dark:opacity-30"
           style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.45), transparent 60%)' }} />
      {/* animated blob */}
      <motion.div
        className="absolute top-1/4 -right-20 h-72 w-72 rounded-full opacity-30 dark:opacity-20"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)' }}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 -left-10 h-64 w-64 rounded-full opacity-25 dark:opacity-20"
        style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)' }}
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
