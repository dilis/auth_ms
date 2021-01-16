require('dotenv').config();

const express = require('express');
const Database = require('./app/database');
const app = express();
const main = require('./app');

const database = Database.forUrl(process.env.DB_URL);
main(database);

app.use(express.json());

app.use('/api/m', require('./routes/entities'));
app.use('/api', require('./routes/methods'));

app.listen(3000);