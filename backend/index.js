require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' })); 

app.get('/', (req, res) => res.send('Backend running'));
app.listen(5000, () => console.log('Server on port 5000'));
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err)
        console.error(err);
    console.log('Connected to SQLite');
});
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS portfolios (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, type TEXT, current_value REAL, purchase_price REAL)`);
  db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, asset_name TEXT, type TEXT, quantity REAL, price REAL, date TEXT)`);
});