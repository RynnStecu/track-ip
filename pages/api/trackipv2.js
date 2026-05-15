import axios from 'axios'

async function getIPData(ip) {
  try {
    const res = await axios.get(`https://ipwho.is/${ip}`, { timeout: 8000 })
    if (res.data.success) return res.data
    throw new Error('ipwho gagal')
  } catch {
    const res2 = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 8000 })
    if (res2.data.status !== 'success') throw new Error('Semua API gagal')
    return {
      ip: res2.data.query,
      success: true,
      type: 'IPv4',
      continent: res2.data.continent,
      continent_code: '',
      country: res2.data.country,
      country_code: res2.data.countryCode,
      flag: { img: `https://flagcdn.com/w320/${res2.data.countryCode.toLowerCase()}.png`, emoji: '' },
      region: res2.data.regionName,
      region_code: res2.data.region,
      city: res2.data.city,
      latitude: res2.data.lat,
      longitude: res2.data.lon,
      is_eu: false,
      postal: res2.data.zip,
      calling_code: '',
      capital: '',
      borders: '',
      connection: {
        asn: '',
        org: res2.data.org,
        isp: res2.data.isp,
        domain: ''
      },
      timezone: {
        id: res2.data.timezone,
        current_time: ''
      },
      currency: { code: '', name: '' },
      languages: '',
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { ip } = req.query
  if (!ip) return res.status(400).json({ error: 'IP required' })

  const isIP = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)
  if (!isIP) return res.status(400).json({ error: 'Format IP tidak valid' })

  try {
    const data = await getIPData(ip)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
