// utils/googleSheets.js
import { google } from 'googleapis';


export async function getSheetRows(gsaKeyString, sheetId, range = 'Sheet1!A:E') {
const key = JSON.parse(gsaKeyString);


const jwtClient = new google.auth.JWT({
email: key.client_email,
key: key.private_key,
scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});


await jwtClient.authorize();


const sheets = google.sheets({ version: 'v4', auth: jwtClient });
const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range });
const rows = res.data.values || [];


if (rows.length === 0) return [];
const headers = rows[0].map(h => h.toString().trim().toLowerCase());
const data = rows.slice(1).map(r => {
const obj = {};
headers.forEach((h, i) => (obj[h] = r[i] || ''));
return obj;
});
return data;
}
