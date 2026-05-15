import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { ip } = req.query
  if (!ip) return res.status(400).json({ error: 'IP required' })

  const isIP = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)
  if (!isIP) return res.status(400).json({ error: 'Format IP tidak valid' })

  try {
    const [ipwho, ipapi, ipapi2] = await Promise.allSettled([
      axios.get(`https://ipwho.is/${ip}`, { timeout: 8000 }),
      axios.get(`https://ipapi.co/${ip}/json`, { timeout: 8000 }),
      axios.get(`http://ip-api.com/json/${ip}`, { timeout: 8000 }),
    ])

    const safe = v => v || null

    const d1 = ipwho.status === 'fulfilled' ? ipwho.value.data : {}
    const d2 = ipapi.status === 'fulfilled' ? ipapi.value.data : {}
    const d3 = ipapi2.status === 'fulfilled' ? ipapi2.value.data : {}

    const result = {
      ip: d1.ip || d2.ip || d3.query,
      type: d1.type || d2.version || 'IPv4',
      continent: d1.continent || '',
      continent_code: d1.continent_code || '',
      country: d1.country || d2.country_name || d3.country,
      country_code: d1.country_code || d2.country_code || d3.countryCode,
      city: d1.city || d2.city || d3.city,
      region: d1.region || d2.region || d3.regionName,
      region_code: d1.region_code || d2.region_code || d3.region,
      latitude: d1.latitude || d2.latitude || d3.lat,
      longitude: d1.longitude || d2.longitude || d3.lon,
      is_eu: d1.is_eu || false,
      postal: d1.postal || d2.postal || d3.zip,
      calling_code: d1.calling_code || d2.country_calling_code || '',
      capital: d1.capital || d2.country_capital || '',
      borders: d1.borders || '',
      isp: d1.connection?.isp || d2.org || d3.isp,
      org: d1.connection?.org || d2.org || d3.org,
      asn: d1.connection?.asn || d2.asn || '',
      timezone: d1.timezone?.id || d2.timezone || d3.timezone,
      currency: d2.currency || d1.currency?.code || '',
      currency_name: d2.currency_name || '',
      languages: d2.languages || d1.languages || '',
      flag: d1.flag?.img
        || (d2.country_code ? `https://flagcdn.com/w320/${d2.country_code.toLowerCase()}.png` : '')
        || (d3.countryCode ? `https://flagcdn.com/w320/${d3.countryCode.toLowerCase()}.png` : ''),
      flag_emoji: d1.flag?.emoji || '',
      sources: {
        ipwho: ipwho.status === 'fulfilled',
        ipapi: ipapi.status === 'fulfilled',
        ipapi2: ipapi2.status === 'fulfilled',
      }
    }

    if (!result.ip) return res.status(500).json({ error: 'Gagal mengambil data dari semua server' })

    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
