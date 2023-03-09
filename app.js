const express = require('express');
const app = express();
const csv = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

app.get('/', (req, res) => {
    // Send a button with bgcolor red and a link to the send-reminders route
    res.send(`<button style="background-color: purple; color: white; font-size: 20px; padding: 10px 20px; margin-left: 20px; margin-top: 20px; border-radius: 5px; border: none;"><a href="/send-reminders" style="color: white;">Send Reminders</a></button>`);
})

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
            // Array data to match the day of the week
            const days = ['M', 'T', 'W', 'Th', 'F'];
            // Split the days string into an array and match the days
            const daysArray = row.Days.split('');
            if (daysArray.includes('T') && daysArray.includes('h')) {
              daysArray.splice(daysArray.indexOf('T'), 1);
              daysArray.splice(daysArray.indexOf('h'), 1);
              daysArray.push('Th');
          }
          console.log(daysArray)
            // Check if the current day is in the daysArray
            if (daysArray.includes(days[currentDay-1])) {
                // Send the reminder
                const message = `Remember to take ${row['Dosage']} of ${row['Medicine']} today!`;
                client.messages
                    .create({
                        body: message,
                        from: process.env.TWILIO_PHONE,
                        to: `+${row.Number}`
                    })
                    .then(message => console.log(message.sid));
            }
        })
        .on('end', () => {
            res.send('<h1>Reminders sent!</h1>');
        });
});

app.listen(3000, console.log(`Server is listening on port 3000...`))