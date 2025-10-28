// utils/googleSheets.js
import { google } from 'googleapis';

export async function getSheetRows(gsaKey, sheetId, range = 'Sheet1!A:E') {
  try {
    const creds = JSON.parse(gsaKey);

    const client = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: client });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = res.data.values || [];
    const [header, ...data] = rows;

    return data.map(row =>
      header.reduce((obj, key, i) => ({ ...obj, [key]: row[i] }), {})
    );
  } catch (err) {
    console.error('❌ Google Sheets fetch error:', err);
    throw new Error('Failed to fetch Google Sheets data');
  }
}
