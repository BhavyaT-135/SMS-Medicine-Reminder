const express = require('express');
const app = express();
const csv = require('csv-parser');
const fs = require('fs');
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.TWILIO_AUTH);