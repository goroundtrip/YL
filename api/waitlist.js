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

        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
        const response = await fetch(`${scriptUrl}?sheet=Waitlist&data=${encodeURIComponent(JSON.stringify({name, email, interest}))}`);

        if (response.ok) {
            res.status(200).json({ message: 'Successfully added to waitlist' });
        } else {
            throw new Error('Failed to add to waitlist');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            message: 'Error processing request',
            error: error.message 
        });
    }
} 