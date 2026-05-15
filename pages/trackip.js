import { useState } from 'react'
import Head from 'next/head'
import {
  Search, Globe, Wifi, MapPin, Clock, DollarSign, Languages,
  Shield, AlertTriangle, CheckCircle2, Server, Navigation,
  Phone, Flag, Building2, Loader2, ChevronRight, Database,
  Hash, ExternalLink
} from 'lucide-react'

const s = {
  page: {
    minHeight: 'calc(100dvh - 56px)',
    padding: '32px 20px 64px',
    maxWidth: 1140,
    margin: '0 auto',
  },
  label: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
  },
  tag: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 9px',
    border: '1px solid var(--border)',
    fontSize: 10, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
}

function Field({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null
  const v = String(value).trim()
  if (!v || v === '-') return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '9px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 26, height: 26, flexShrink: 0,
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-dim)', marginTop: 1,
      }}>
        <Icon size={12} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...s.label, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text)', wordBreak: 'break-word', lineHeight: 1.5 }}>{v}</div>
      </div>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: '16px 18px 6px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        marginBottom: 10, paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ width: 2, height: 12, background: 'var(--text)', flexShrink: 0 }} />
        <span style={{ ...s.label, color: 'var(--text-muted)' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function TrackIP() {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = async (e) => {
    e?.preventDefault()
    const val = ip.trim()
    if (!val) return
    if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(val)) {
      setError('Format IP tidak valid. Contoh: 103.217.224.106')
      return
    }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch(`/api/trackip?ip=${encodeURIComponent(val)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const mapLink = result ? `https://www.openstreetmap.org/?mlat=${result.latitude}&mlon=${result.longitude}&zoom=12` : null

  return (
    <>
      <Head>
        <title>TrackIP — Multi-Source IP Intelligence</title>
      </Head>

      <div style={s.page}>
        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <Database size={10} color="var(--text-dim)" />
            <span style={{ ...s.label }}>Multi-Source · v1.0 · 3 APIs</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--text)',
            marginBottom: 16,
          }}>
            TRACK<br /><span style={{ color: 'var(--text-dim)' }}>IP.SYS</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 380, lineHeight: 1.7 }}>
            Agregasi dari 3 server: ipwho.is, ipapi.co, ip-api.com
          </p>
        </div>

        {/* Search */}
        <form onSubmit={search} style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 6 }}><span style={s.label}>Target IP Address</span></div>
          <div style={{
            display: 'flex',
            maxWidth: 580,
            border: '1px solid var(--border-bright)',
            background: 'var(--surface)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '0 13px',
              borderRight: '1px solid var(--border)',
              color: 'var(--text-dim)',
              flexShrink: 0,
            }}>
              <Globe size={14} />
            </div>
            <input
              type="text" inputMode="decimal"
              value={ip}
              onChange={e => setIp(e.target.value)}
              placeholder="103.217.224.106"
              style={{
                flex: 1, padding: '13px 14px',
                background: 'transparent',
                border: 'none', outline: 'none',
                color: 'var(--text)',
                fontSize: 14,
                letterSpacing: '0.04em',
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '13px 20px',
                flexShrink: 0,
                background: loading ? 'var(--surface2)' : 'var(--text)',
                border: 'none',
                color: loading ? 'var(--text-muted)' : 'var(--bg)',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 7,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.12s',
                whiteSpace: 'nowrap',
              }}
            >
              {loading
                ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                : <Search size={13} />}
              {loading ? 'WAIT' : 'TRACK'}
            </button>
          </div>
        </form>

        {/* Loading chips */}
        {loading && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {['ipwho.is', 'ipapi.co', 'ip-api.com'].map((src, i) => (
              <div key={src} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 12px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                animation: `pulseOp 1.4s ease ${i * 0.18}s infinite`,
              }}>
                <Loader2 size={10} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-dim)' }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{src}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
            border: '1px solid var(--border-bright)',
            background: 'var(--surface)',
            maxWidth: 580, marginBottom: 24,
          }}>
            <AlertTriangle size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ animation: 'fadeUp 0.25s ease' }}>
            {/* IP header */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'space-between', alignItems: 'flex-start',
              gap: 16,
              padding: '18px 20px',
              background: 'var(--surface)',
              border: '1px solid var(--border-bright)',
              marginBottom: 2,
            }}>
              <div>
                <div style={{ ...s.label, marginBottom: 6 }}>Detected IP</div>
                <div style={{
                  fontFamily: 'var(--display)',
                  fontSize: 'clamp(22px, 5vw, 40px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--text)', lineHeight: 1.1,
                }}>{result.ip}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {[result.type, result.country_code, result.is_eu && 'EU'].filter(Boolean).map(t => (
                    <span key={t} style={s.tag}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Source status */}
              <div>
                <div style={{ ...s.label, marginBottom: 8 }}>Data Sources</div>
                {Object.entries(result.sources || {}).map(([k, ok]) => (
                  <div key={k} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 11, color: ok ? 'var(--text-muted)' : 'var(--text-dim)',
                    marginBottom: 5,
                  }}>
                    {ok
                      ? <CheckCircle2 size={11} />
                      : <AlertTriangle size={11} />}
                    {k === 'ipwho' ? 'ipwho.is' : k === 'ipapi' ? 'ipapi.co' : 'ip-api.com'}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 2,
            }}>
              <Block title="Location">
                <Field icon={Flag} label="Negara" value={`${result.country || ''} ${result.flag_emoji || ''}`.trim()} />
                <Field icon={Building2} label="Kontinen" value={[result.continent, result.continent_code && `(${result.continent_code})`].filter(Boolean).join(' ')} />
                <Field icon={MapPin} label="Region" value={result.region} />
                <Field icon={MapPin} label="Kota" value={result.city} />
                <Field icon={Phone} label="Kode Pos" value={result.postal} />
                <Field icon={Navigation} label="Ibu Kota" value={result.capital} />
                <Field icon={Shield} label="Batas" value={result.borders} />
              </Block>

              <Block title="Coordinates & Time">
                <Field icon={Navigation} label="Latitude" value={result.latitude} />
                <Field icon={Navigation} label="Longitude" value={result.longitude} />
                <Field icon={Phone} label="Kode Telp" value={result.calling_code ? `+${result.calling_code}` : null} />
                <Field icon={Clock} label="Timezone" value={result.timezone} />
                {mapLink && (
                  <a href={mapLink} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 0', borderBottom: '1px solid var(--border)',
                      color: 'var(--text-muted)', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}>
                    <MapPin size={12} />
                    OpenStreetMap
                    <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                  </a>
                )}
              </Block>

              <Block title="Network">
                <Field icon={Hash} label="ASN" value={result.asn} />
                <Field icon={Wifi} label="ISP" value={result.isp} />
                <Field icon={Server} label="Organisasi" value={result.org} />
              </Block>

              <Block title="Locale">
                <Field icon={DollarSign} label="Mata Uang" value={[result.currency, result.currency_name].filter(Boolean).join(' — ')} />
                <Field icon={Languages} label="Bahasa" value={result.languages} />
              </Block>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 56,
          paddingTop: 18,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{ ...s.label }}>dev: RynnStecuSigamSkibidi</span>
          <a href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D"
            target="_blank" rel="noopener noreferrer"
            style={{ ...s.label, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Globe size={10} />WA Channel ↗
          </a>
        </div>
      </div>
    </>
  )
}
