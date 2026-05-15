import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { X, Menu, Globe, Zap, MessageCircle, Terminal, Code2, ChevronRight } from 'lucide-react'

const NAV_H = 56

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setOpen(false)
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  }, [router])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navItems = [
    { href: '/trackip', label: 'TrackIP', sub: 'Multi-source', icon: Globe },
    { href: '/trackipv2', label: 'TrackIP v2', sub: 'Focused mode', icon: Zap },
  ]

  const active = (href) => router.pathname === href

  return (
    <>
      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid transparent;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--text);
          border-color: var(--border);
        }
        .nav-link.nav-active {
          color: var(--bg);
          background: var(--text);
          border-color: var(--text);
        }
        .burger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .burger-btn:hover { border-color: var(--border-bright); color: var(--text); }
        .drawer-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 24px;
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.12s, color 0.12s;
          width: 100%;
          border-left: 0;
          border-right: 0;
          border-top: 0;
        }
        .drawer-item:hover, .drawer-item:active {
          background: var(--surface2);
          color: var(--text);
        }
        .drawer-item.drawer-active {
          color: var(--text);
          background: var(--surface2);
        }
        .wa-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: var(--surface2);
          color: var(--text);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.12s;
        }
        .wa-link:hover, .wa-link:active { background: var(--surface3); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: NAV_H,
        zIndex: 1000,
        background: scrolled ? 'rgba(10,10,10,0.96)' : 'rgba(10,10,10,0.88)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-bright)' : 'var(--border)'}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'border-color 0.2s, background 0.2s',
      }}>
        <div style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          {/* Logo */}
          <Link href="/trackip" style={{
            display: 'flex', alignItems: 'center', gap: 9,
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            <div style={{
              width: 30, height: 30, background: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            }}>
              <Terminal size={14} color="var(--bg)" />
            </div>
            <span style={{
              fontFamily: 'var(--display)',
              fontSize: 16, fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              lineHeight: 1,
            }}>
              TRACKIP<span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>.SYS</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginRight: 8 }}
              className="desktop-nav">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className={`nav-link${active(href) ? ' nav-active' : ''}`}>
                  <Icon size={12} />
                  {label}
                </Link>
              ))}
            </div>

            <button
              className="burger-btn"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 1001,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: NAV_H,
        right: 0,
        width: 'min(320px, 88vw)',
        bottom: 0,
        zIndex: 1002,
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border-bright)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {/* Section: Navigation */}
        <div style={{
          padding: '16px 24px 10px',
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
            color: 'var(--text-dim)', textTransform: 'uppercase',
          }}>Navigation</span>
        </div>

        {navItems.map(({ href, label, sub, icon: Icon }) => (
          <Link key={href} href={href}
            className={`drawer-item${active(href) ? ' drawer-active' : ''}`}>
            <div style={{
              width: 34, height: 34, flexShrink: 0,
              background: active(href) ? 'var(--text)' : 'var(--surface2)',
              border: `1px solid ${active(href) ? 'var(--text)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: active(href) ? 'var(--bg)' : 'var(--text-muted)',
            }}>
              <Icon size={15} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: active(href) ? 'var(--text)' : 'var(--text-muted)' }}>{label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{sub}</div>
            </div>
            {active(href) && (
              <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.12em' }}>ACTIVE</span>
            )}
          </Link>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Dev + Channel */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28,
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Code2 size={13} color="var(--text-muted)" />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 2 }}>Developer</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>RynnStecuSigamSkibidi</div>
            </div>
          </div>

          <a
            href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-link"
          >
            <MessageCircle size={15} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>WhatsApp Channel</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>Join sekarang</div>
            </div>
            <ChevronRight size={13} style={{ marginLeft: 'auto', color: 'var(--text-dim)' }} />
          </a>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}
