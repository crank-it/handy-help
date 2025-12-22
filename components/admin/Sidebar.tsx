'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, DollarSign, Menu, X, MessageCircle, FileText, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Schedule', href: '/admin/schedule', icon: Calendar },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Proposals', href: '/admin/proposals', icon: FileText },
  { name: 'Messages', href: '/admin/messages', icon: MessageCircle },
  { name: 'Earnings', href: '/admin/earnings', icon: DollarSign },
  { name: 'Redwoods Lane', href: '/admin/redwoods', icon: MapPin },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Handy Help"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-bold text-brand-primary">Admin</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-bg-muted rounded-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col z-40 transition-transform duration-300',
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Handy Help"
              width={50}
              height={50}
              className="object-contain"
            />
            <div>
              <div className="font-bold text-brand-primary">Handy Help</div>
              <div className="text-xs text-text-muted">Admin Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:bg-bg-muted hover:text-brand-primary'
                )}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <div className="flex-1">
              <div className="font-semibold text-text-primary text-sm">Admin</div>
              <div className="text-xs text-text-muted">Handy Help NZ</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-xs text-text-muted hover:text-brand-primary text-center"
            >
              Back to site
            </Link>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
