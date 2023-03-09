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
    
    client.messages.create({
          to: '+918287810214',
          from: process.env.TWILIO_PHONE,
          body: "This is a test message for Twilio!"
      })
      .then(
        console.log("Message sent successfully")
      );
});

app.listen(3000, console.log(`Server is listening on port 3000...`))