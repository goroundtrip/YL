const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getAuthToken() {
    try {
        console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        console.log('Credentials client_email:', credentials.client_email);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });
        return auth;
    } catch (error) {
        console.error('Error in getAuthToken:', error);
        throw error;
    }
}

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, interest } = req.body;
        console.log('Received data:', { name, email, interest });
        
        // Get auth token
        const auth = await getAuthToken();
        const sheets = google.sheets({ version: 'v4', auth });

        // Verify sheet exists
        try {
            const sheetInfo = await sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID,
            });
            console.log('Sheet info:', sheetInfo.data);
        } catch (error) {
            console.error('Error getting sheet info:', error);
        }

        // Append data to Google Sheet
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Waitlist!A:C',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[name, email, interest]]
            }
        });

        console.log('Google Sheets API Response:', response.data);

        res.status(200).json({ message: 'Successfully added to waitlist' });
    } catch (error) {
        console.error('Detailed Error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ 
            message: 'Error processing request',
            error: error.message 
        });
    }
} 