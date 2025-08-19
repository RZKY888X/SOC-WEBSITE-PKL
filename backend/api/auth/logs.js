import db from '@/libary/db'

export default async function handler(req, res) {
  try {
    const result = await db.query(`
      SELECT device, sensor, status, lastvalue, timestamp
      FROM prtg_logs
      WHERE device = 'DESKTOP-OT2EVTR'
      ORDER BY timestamp DESC
      LIMIT 20
    `)
    res.status(200).json(result.rows)
  } catch (error) {
    console.error('❌ API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}