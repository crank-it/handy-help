import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-bg-page to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Large Logo */}
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="Handy Help Lawn Mowing"
                width={300}
                height={300}
                className="object-contain mx-auto"
                priority
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-brand-primary mb-6">
              Here to help
            </h1>
            <p className="text-2xl md:text-3xl text-brand-dark font-semibold mb-10">
              Local help you can rely on
            </p>
            <Link href="/book/address">
              <Button variant="primary" size="lg">
                Book Your Service
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-24 bg-bg-page">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-primary mb-8">
              Meet William
            </h2>
            <p className="text-xl md:text-2xl text-text-primary mb-6 leading-relaxed">
              Hi I'm William, 15 year old Otago Boys student. Here to help you around the house.
            </p>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
              With guidance from my father Ben—who has 20 years of experience building successful businesses
              like{' '}
              <a
                href="https://yoonet.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-secondary font-semibold underline"
              >
                Yoonet
              </a>
              {' '}and{' '}
              <a
                href="https://outeredge.nz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:text-brand-secondary font-semibold underline"
              >
                Outer Edge
              </a>
              —you get the reliability of experienced business practices with the enthusiasm of a motivated young entrepreneur.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
            Book your first lawn service in just a few minutes
          </p>
          <Link href="/book/address">
            <button className="px-8 py-4 bg-white text-brand-primary font-bold text-lg rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
              Book Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <Image
                    src="/logo.png"
                    alt="Handy Help"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                  <span className="font-bold text-brand-primary">Handy Help</span>
                </div>
                <p className="text-sm text-text-muted">Founded 2025</p>
                <p className="text-sm text-text-muted">Run by William Carter, 15</p>
                <p className="text-sm text-text-muted">
                  Supported by{' '}
                  <a
                    href="https://yoonet.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-secondary font-semibold"
                  >
                    Yoonet
                  </a>
                  {' '}& {' '}
                  <a
                    href="https://outeredge.nz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-secondary font-semibold"
                  >
                    Outer Edge
                  </a>
                </p>
              </div>
              <div className="text-center md:text-right">
                <a
                  href="mailto:contact@handyhelp.nz"
                  className="text-brand-primary hover:text-brand-secondary font-semibold"
                >
                  contact@handyhelp.nz
                </a>
                <p className="text-sm text-text-muted mt-2">Dunedin, New Zealand</p>
              </div>
            </div>
            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-text-muted">
                © {new Date().getFullYear()} Handy Help NZ. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
