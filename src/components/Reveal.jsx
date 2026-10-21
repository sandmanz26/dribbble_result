import { motion } from 'motion/react'

// Fades sections in as they enter the viewport so the page reads in order.
// MotionConfig reducedMotion="user" turns this into an instant render.
export default function Reveal({ as = 'div', delay = 0, children, ...rest }) {
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </M>
  )
}
