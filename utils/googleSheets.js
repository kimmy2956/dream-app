// utils/googleSheets.js
import { google } from 'googleapis';

/**
 * อ่านข้อมูลจาก Google Sheet
 * @param {string} gsaKey JSON string ของ Google Service Account
 * @param {string} sheetId ID ของ Google Sheet
 * @param {string} range เช่น "Sheet1!A:E"
 */
export async function getSheetRows(gsaKey, sheetId, range) {
  try {
    // ✅ แปลง string จาก env เป็น object
    const credentials = JSON.parse(gsaKey);

    // ✅ แก้ให้ \n กลับมาเป็นบรรทัดจริง (ป้องกัน error:1E08010C)
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    if (!response.data.values) {
      return [];
    }

    const [header, ...rows] = response.data.values;

    // แปลง rows ให้เป็น object โดยใช้ header เป็น key
    return rows.map(row => {
      const obj = {};
      header.forEach((key, i) => (obj[key] = row[i]));
      return obj;
    });
  } catch (error) {
    console.error('❌ Google Sheets fetch error:', error);
    throw new Error('Failed to fetch Google Sheets data');
  }
}
