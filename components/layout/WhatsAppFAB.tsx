'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { DEALER_INFO, generateWhatsAppUrl } from '@/lib/utils'

export default function WhatsAppFAB() {
  const [expanded, setExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => setShowTooltip(true), 3000)
    const hide = setTimeout(() => setShowTooltip(false), 7000)
    return () => { clearTimeout(timer); clearTimeout(hide) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !expanded && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="glass-dark rounded-2xl px-4 py-3 max-w-[200px] text-right"
          >
            <p className="text-white text-xs font-medium">Chat with us on WhatsApp!</p>
            <p className="text-gray-400 text-xs mt-0.5">We reply within minutes</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.a
        href={generateWhatsAppUrl(DEALER_INFO.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
        </motion.div>
      </motion.a>
    </div>
  )
}
