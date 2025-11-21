import Link from "next/link"
import { Compass, Mail, Archive } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-primary/20 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 backdrop-blur-sm">
      {/* Decorative top divider */}
      <div className="flex items-center justify-center gap-3 px-4 py-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative">
          <div className="w-2 h-2 bg-primary/60 rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main footer grid - simplified to 2 columns */}
          <div className="grid gap-12 md:grid-cols-2 py-12">
            {/* Brand section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent p-1.5">
                  <Compass className="w-full h-full text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">Imageboard</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An anonymous online platform for image-based discussions. Users can post threads and engage in conversations across multiple boards.
              </p>
            </div>

            {/* Quick links */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-widest text-primary">Quick Links</h3>
              <nav className="flex flex-col gap-2 text-sm">
                <a
                  href="mailto:thirapi@duck.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
                <a
                  href="https://github.com/thirapi/imageboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Contribute on GitHub
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom divider and copyright */}
          <div className="space-y-4 border-t border-primary/10 pt-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
              <p>
                © {currentYear} <span className="text-primary font-semibold">Imageboard</span>. All rights reserved.
              </p>

              {/* Geometric footer accent */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary/40 rounded-full" />
                <div className="w-1 h-1 bg-primary/60 rounded-full" />
                <div className="w-1 h-1 bg-primary/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
