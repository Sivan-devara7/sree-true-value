'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin, Clock, Mail, Send, CheckCircle } from 'lucide-react'
import { DEALER_INFO, generateWhatsAppUrl, generateCallUrl } from '@/lib/utils'

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // In production, save to Supabase inquiries table
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Hero */}
      <div className="bg-gray-950 py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
              Get In <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Have questions about a car? Want to schedule a visit? We're here to help.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-white/8 shadow-sm">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    We'll get back to you shortly. You can also WhatsApp us for a faster response.
                  </p>
                  <a
                    href={generateWhatsAppUrl(DEALER_INFO.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25d366] text-white text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Continue on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Your Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Ravi Kumar"
                        className="input-field"
                        id="contact-name"
                      />
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 90008 30755"
                        className="input-field"
                        id="contact-phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="ravi@example.com"
                      className="input-field"
                      id="contact-email"
                    />
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      placeholder="I'm looking for a car under ₹8 Lakh, petrol, automatic..."
                      className="input-field resize-none"
                      id="contact-message"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                    id="contact-submit"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info Column */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Quick Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={generateCallUrl(DEALER_INFO.phone)}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-white/8 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Call Us</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{DEALER_INFO.phone}</div>
                </div>
              </a>

              <a
                href={generateWhatsAppUrl(DEALER_INFO.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-white/8 hover:border-green-500/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25d366]/10 flex items-center justify-center group-hover:bg-[#25d366]/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-[#25d366]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">WhatsApp</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">Chat Now</div>
                </div>
              </a>
            </div>

            {/* Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-white/8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Address</div>
                  <div className="text-sm text-gray-500 mt-0.5">{DEALER_INFO.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Business Hours</div>
                  <div className="text-sm text-gray-500 mt-0.5">{DEALER_INFO.hours}</div>
                  <div className="text-sm text-gray-400">{DEALER_INFO.sunday}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Email</div>
                  <a href={`mailto:${DEALER_INFO.email}`} className="text-sm text-gray-500 mt-0.5 hover:text-gold-500 transition-colors">
                    {DEALER_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/8 shadow-sm" style={{ height: '260px' }}>
              <iframe
                src={DEALER_INFO.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sree True Value Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
