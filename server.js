require('dotenv').config();

const express = require('express');
const Database = require('./app/database');
const app = express();
const loyaltyApp = require('./app');

const database = Database.forUrl(process.env.db_url);
loyaltyApp(database);

app.use(express.json());

app.use('/api/m', require('./routes/entities'));
app.use('/api', require('./routes/methods'));

app.listen(3000);