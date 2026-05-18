'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, MapPin, Clock, Mail } from 'lucide-react'
import { DEALER_INFO, generateWhatsAppUrl, generateCallUrl } from '@/lib/utils'

export default function ContactSection() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider block mb-2">
              Visit Us
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white leading-tight mb-4">
              Come Find Your{' '}
              <span className="text-gradient-gold">Dream Car</span>
            </h2>
            <p className="text-gray-400 text-base mb-8">
              Visit our showroom in Kakinada or reach us via WhatsApp, phone, or email.
              Our team is available 6 days a week to assist you.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 glass-dark rounded-xl p-4 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Address</div>
                  <div className="text-white text-sm font-medium mt-0.5">{DEALER_INFO.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 glass-dark rounded-xl p-4 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Business Hours</div>
                  <div className="text-white text-sm font-medium mt-0.5">{DEALER_INFO.hours}</div>
                  <div className="text-gray-400 text-xs">{DEALER_INFO.sunday}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 glass-dark rounded-xl p-4 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Email</div>
                  <a href={`mailto:${DEALER_INFO.email}`} className="text-white text-sm font-medium mt-0.5 hover:text-gold-400 transition-colors">
                    {DEALER_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <a
                href={generateCallUrl(DEALER_INFO.phone)}
                className="btn-primary flex-1 justify-center"
              >
                <Phone className="w-4 h-4" />
                Call {DEALER_INFO.phone}
              </a>
              <a
                href={generateWhatsAppUrl(DEALER_INFO.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-[#25d366] hover:bg-[#20b859] text-white shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ height: '450px' }}
          >
            <iframe
              src={DEALER_INFO.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(30%) invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sree True Value Location - Kakinada"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
