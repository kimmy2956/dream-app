// utils/googleSheets.js
import { google } from 'googleapis';

export async function getSheetRows(gsaKey, sheetId, range) {
  try {
    const creds = JSON.parse(gsaKey.replace(/\n/g, '\\n')); // ป้องกัน newline พัง
    const client = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: await client.getClient() });
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });

    const rows = res.data.values;
    if (!rows || rows.length === 0) return [];

    // สมมติว่าแถวแรกเป็น header
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, h, i) => {
        obj[h.trim()] = row[i] || '';
        return obj;
      }, {})
    );

    return data;
  } catch (err) {
    console.error('❌ Google Sheets fetch error:', err.response?.data || err.message || err);
    throw new Error('Failed to fetch Google Sheets data');
  }
}

