const express = require('express');
const app = express();
const csv = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

app.get('/send-reminders', (req, res) => {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH;
    const client = twilio(accountSid, authToken);
    
    fs.createReadStream('PatientData.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Get current day of the week
            const currentDate = new Date();
            const currentDay = currentDate.getDay();
            console.log(currentDay);
            console.log(row);
        })
        .on('end', () => {
            res.send('Reminders sent!');
        });
});

app.listen(3000, console.log(`Server is listening on port 3000...`))