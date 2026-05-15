import { useState } from 'react'
import Head from 'next/head'
import {
  Search, Globe, Wifi, MapPin, Clock, Server,
  Navigation, Phone, Flag, Building2, Loader2,
  Zap, Hash, Network, ShieldCheck, AlertTriangle,
  CheckCircle2, ExternalLink, ChevronRight
} from 'lucide-react'

const sLabel = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--text-dim)',
}

function Row({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null
  const v = String(value).trim()
  if (!v || v === '-') return null
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '100px 1fr',
      gap: 10, padding: '8px 0',
      borderBottom: '1px solid var(--border)',
      alignItems: 'start',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={10} color="var(--text-dim)" />
        <span style={{ ...sLabel }}>{label}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text)', wordBreak: 'break-word', lineHeight: 1.5 }}>{v}</div>
    </div>
  )
}

function DataSection({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderTop: 'none',
      padding: '4px 18px 8px',
    }}>
      <div style={{ paddingTop: 10, paddingBottom: 6, ...sLabel, color: 'var(--text-muted)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function TrackIPv2() {
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
      const res = await fetch(`/api/trackipv2?ip=${encodeURIComponent(val)}`)
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
        <title>TrackIP v2 — Focused IP Lookup</title>
      </Head>

      <div style={{
        minHeight: 'calc(100dvh - 56px)',
        padding: '32px 20px 64px',
        maxWidth: 1140,
        margin: '0 auto',
      }}>
        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '4px 11px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            marginBottom: 14,
          }}>
            <Zap size={10} color="var(--text-dim)" />
            <span style={{ ...sLabel }}>Version 2 · Focused Mode</span>
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
            TRACK<br />
            <span style={{ WebkitTextStroke: '1px var(--border-bright)', color: 'transparent' }}>IP v2</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 380, lineHeight: 1.7 }}>
            Single-source presisi tinggi. ipwho.is primary, ip-api.com fallback otomatis.
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: result ? 'minmax(260px, 420px) 1fr' : '1fr',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* Left: search + config */}
          <div>
            <form onSubmit={search} style={{ marginBottom: 20 }}>
              <div style={{ marginBottom: 6 }}><span style={sLabel}>Target IP Address</span></div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text" inputMode="decimal"
                  value={ip}
                  onChange={e => setIp(e.target.value)}
                  placeholder="103.217.224.106"
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    paddingRight: 90,
                    background: 'var(--surface)',
                    border: '1px solid var(--border-bright)',
                    color: 'var(--text)',
                    fontSize: 14,
                    letterSpacing: '0.04em',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    position: 'absolute', right: 0, top: 0, bottom: 0,
                    padding: '0 16px',
                    background: loading ? 'var(--surface2)' : 'var(--text)',
                    border: 'none',
                    color: loading ? 'var(--text-muted)' : 'var(--bg)',
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: 6,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.12s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {loading
                    ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Search size={12} />}
                  {loading ? '' : 'SCAN'}
                </button>
              </div>
            </form>

            {/* API chain */}
            <div style={{
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              marginBottom: 20,
            }}>
              <div style={{ ...sLabel, marginBottom: 10 }}>API Chain</div>
              {[
                { icon: ShieldCheck, label: 'Primary', value: 'ipwho.is' },
                { icon: Network, label: 'Fallback', value: 'ip-api.com' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 8,
                }}>
                  <Icon size={12} color="var(--text-dim)" />
                  <span style={{ ...sLabel, minWidth: 50, color: 'var(--text-dim)' }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px',
                border: '1px solid var(--border-bright)',
                background: 'var(--surface)',
                marginBottom: 16,
              }}>
                <AlertTriangle size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{error}</span>
              </div>
            )}

            {loading && (
              <div style={{
                padding: '24px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}>
                <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
                <span style={{ ...sLabel }}>Mengambil data...</span>
              </div>
            )}
          </div>

          {/* Right: result */}
          {result && (
            <div style={{ animation: 'fadeUp 0.22s ease' }}>
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--border-bright)',
              }}>
                <div>
                  <div style={{ ...sLabel, marginBottom: 4 }}>Target</div>
                  <div style={{
                    fontFamily: 'var(--display)',
                    fontSize: 'clamp(18px, 4vw, 28px)',
                    fontWeight: 800, color: 'var(--text)',
                    letterSpacing: '-0.02em', lineHeight: 1.1,
                  }}>{result.ip}</div>
                </div>
                {result.success
                  ? <CheckCircle2 size={16} color="var(--text-muted)" />
                  : <AlertTriangle size={16} color="var(--text-muted)" />}
              </div>

              <DataSection title="Lokasi">
                <Row icon={Flag} label="Negara" value={result.country} />
                <Row icon={Building2} label="Kontinen" value={result.continent} />
                <Row icon={MapPin} label="Region" value={[result.region, result.region_code && `(${result.region_code})`].filter(Boolean).join(' ')} />
                <Row icon={MapPin} label="Kota" value={result.city} />
                <Row icon={Phone} label="Kode Pos" value={result.postal} />
                <Row icon={Navigation} label="Ibu Kota" value={result.capital} />
              </DataSection>

              <DataSection title="Koordinat">
                <Row icon={Navigation} label="Latitude" value={result.latitude} />
                <Row icon={Navigation} label="Longitude" value={result.longitude} />
              </DataSection>

              <DataSection title="Koneksi">
                <Row icon={Hash} label="ASN" value={result.connection?.asn} />
                <Row icon={Server} label="Org" value={result.connection?.org} />
                <Row icon={Wifi} label="ISP" value={result.connection?.isp} />
                <Row icon={Globe} label="Domain" value={result.connection?.domain} />
              </DataSection>

              <DataSection title="Waktu">
                <Row icon={Clock} label="Timezone" value={result.timezone?.id} />
                <Row icon={Clock} label="Lokal" value={result.timezone?.current_time} />
              </DataSection>

              {mapLink && (
                <a href={mapLink} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 18px',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderTop: 'none',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    transition: 'background 0.1s',
                  }}>
                  <MapPin size={12} />
                  Buka di OpenStreetMap
                  <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                </a>
              )}
            </div>
          )}
        </div>

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
          <span style={sLabel}>dev: RynnStecuSigamSkibidi</span>
          <a href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D"
            target="_blank" rel="noopener noreferrer"
            style={{ ...sLabel, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Globe size={10} />WA Channel ↗
          </a>
        </div>
      </div>
    </>
  )
}
