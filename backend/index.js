require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' })); 

app.get('/', (req, res) => res.send('Backend running'));

// Middleware for protected routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], (err) => {
    if (err) {
        console.error(err);
        return res.status(400).json({ error: 'User exists' });
    }
    res.json({ message: 'User registered' });
  });
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err || !user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

app.get('/portfolio', authMiddleware, (req, res) => {
  db.all('SELECT * FROM portfolios WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});
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