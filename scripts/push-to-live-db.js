const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DATA_FILE = path.join(__dirname, '..', 'data', 'site-data.json');
const TARGET_URL = 'https://zeynepyon.com/api/restore-db';
const SECRET_KEY = 'ZeynepYon2026RestoreKey';

console.log('🔄 Reading local data...');
const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(jsonData);

console.log('🚀 Sending data to ' + TARGET_URL + '...');

const postData = JSON.stringify({
    key: SECRET_KEY,
    data: data
});

const url = new URL(TARGET_URL);
const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => { responseData += chunk; });
    res.on('end', () => {
        console.log('Response Code: ' + res.statusCode);
        console.log('Response Body: ' + responseData);
        if (res.statusCode === 200) {
            console.log('✅ Success! Data restored to live DB.');
        } else {
            console.error('❌ Failed.');
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Request error: ' + e.message);
});

req.write(postData);
req.end();
