// pages/api/dreams.js
import { getSheetRows } from '../../utils/googleSheets';

export default async function handler(req, res) {
  try {
    const { query } = req;
    const sheetId = process.env.GSHEET_ID;
    const gsaKey = process.env.GSA_KEY; // เป็น JSON string จาก .env หรือ Vercel

    // ตรวจสอบว่ามีค่าใน env ครบหรือไม่
    if (!sheetId || !gsaKey) {
      return res.status(500).json({ error: 'Missing server configuration (GSHEET_ID or GSA_KEY)' });
    }

    // ดึงข้อมูลจาก Google Sheet
    const rows = await getSheetRows(gsaKey, sheetId, 'Sheet1!A:E');

    // รองรับการค้นหา (เช่น /api/dreams?q=งู)
    const q = (query.q || '').toLowerCase();
    let results = rows;
    if (q) {
      results = rows.filter(r =>
        (r.keyword || '').toLowerCase().includes(q) ||
        (r.tags || '').toLowerCase().includes(q)
      );
    }

    // cache 1 นาที
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ data: results });
  } catch (err) {
    console.error('❌ API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
