import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CustomerPortalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Handy Help"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <div className="font-bold text-brand-primary">Handy Help</div>
              <div className="text-xs text-text-muted">Customer Portal</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-text-secondary text-sm">
        <p className="mb-2">Questions? Contact us anytime</p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="mailto:contact@handyhelp.nz"
            className="text-brand-primary hover:text-brand-secondary font-semibold"
          >
            contact@handyhelp.nz
          </a>
          <span>•</span>
          <a
            href="tel:0221234567"
            className="text-brand-primary hover:text-brand-secondary font-semibold"
          >
            022 123 4567
          </a>
        </div>
      </footer>
    </div>
  )
}

