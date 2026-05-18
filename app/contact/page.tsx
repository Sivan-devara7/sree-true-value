import { Metadata } from 'next'
import ContactPageClient from './_ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us — Sree True Value Kakinada',
  description: 'Contact Sree True Value, Kakinada. Call, WhatsApp, or visit our showroom. We are open Mon–Sat 9AM–7PM.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
