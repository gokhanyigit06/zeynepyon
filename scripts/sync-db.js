const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://zeynepyon.com/api/content';
const DATA_FILE = path.join(__dirname, '..', 'data', 'site-data.json');

console.log('🔄 Syncing data from ' + API_URL + '...');

https.get(API_URL, (res) => {
    if (res.statusCode !== 200) {
        console.error('❌ Failed to fetch data: StatusCode ' + res.statusCode);
        res.resume();
        return;
    }

    let rawData = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            fs.writeFileSync(DATA_FILE, JSON.stringify(parsedData, null, 2));
            console.log('✅ Successfully synced data to data/site-data.json');
        } catch (e) {
            console.error('❌ Error parsing JSON: ' + e.message);
        }
    });
}).on('error', (e) => {
    console.error('❌ Got error: ' + e.message);
});
