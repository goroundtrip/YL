const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getAuthToken() {
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
    });
    return auth;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, interest } = req.body;
        
        // Get auth token
        const auth = await getAuthToken();
        const sheets = google.sheets({ version: 'v4', auth });

        // Append data to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Waitlist!A:C', // Assuming columns A, B, C for name, email, interest
            valueInputOption: 'RAW',
            requestBody: {
                values: [[name, email, interest]]
            }
        });

        res.status(200).json({ message: 'Successfully added to waitlist' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error processing request' });
    }
} 