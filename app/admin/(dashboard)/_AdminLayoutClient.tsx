'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car, LayoutDashboard, Plus, List, LogOut, Menu, X, ChevronRight, User as UserIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cars', label: 'All Listings', icon: List },
  { href: '/admin/cars/new', label: 'Add New Car', icon: Plus },
]

interface Props {
  children: React.ReactNode
  user: User
}

export default function AdminLayoutClient({ children, user }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/8">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-black">
            <img src="/images/logo.jpg" alt="Sree True Value" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-none">
              Sree True Value
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Admin Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`admin-sidebar-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {(pathname === item.href) && (
              <ChevronRight className="w-3.5 h-3.5 text-gold-500" />
            )}
          </Link>
        ))}

        <div className="pt-4">
          <Link
            href="/"
            target="_blank"
            className="admin-sidebar-item text-xs"
          >
            <Car className="w-4 h-4" />
            View Live Site
          </Link>
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gold-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">Admin</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-900 border-r border-white/8 flex-shrink-0 fixed inset-y-0 left-0 z-30 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-white/8 z-50 overflow-y-auto lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-white/8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-display font-bold text-white text-sm">Admin Dashboard</div>
          <div className="w-9" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
