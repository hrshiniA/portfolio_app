require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); 

app.get('/', (_req, res) => res.send('Backend running'));

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

// Register endpoint for User Sign In
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

// Login endpoint for User with existing account
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

// Get portfolio for logged-in user
app.get('/portfolio', authMiddleware, (req, res) => {
  db.all('SELECT * FROM portfolios WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});

// Get all transactions for logged-in user
app.get('/transactions', authMiddleware, (req, res) => {
  db.all('SELECT * FROM transactions WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err){
      return res.status(500).json({error: 'DB error'});
    }
    res.json(rows);
  })
});

//add investment
app.post('/portfolio', authMiddleware, (req, res) => {
  const { name, type, current_value, purchase_price } = req.body;
  db.run(
    'INSERT INTO portfolios (user_id, name, type, current_value, purchase_price) VALUES (?, ?, ?, ?, ?)',
    [req.userId, name, type, current_value, purchase_price], (err) => {
      if (err) {
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'Investment added' });
    });
});

// edit investment
app.get('/portfolio/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM portfolios WHERE id = ? AND user_id = ?', [id, req.userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (!row) return res.status(404).json({ error: 'Investment not found' });
    res.json(row);
  });
});

// Update investment
app.put('/portfolio/:id', authMiddleware, (req, res) => {
  const { name, type, current_value, purchase_price } = req.body;
  db.run(
    'UPDATE portfolios SET name = ?, type = ?, current_value = ?, purchase_price = ? WHERE id = ? AND user_id = ?',
    [name, type, current_value, purchase_price, req.params.id, req.userId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'Investment updated' });
    }
  );
});

// Add transaction
app.post('/transactions', authMiddleware, (req, res) => {
  const { asset_name, type, quantity, price } = req.body;
  const date = new Date().toISOString();
  db.run(
    'INSERT INTO transactions (user_id, asset_name, type, quantity, price, date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.userId, asset_name, type, quantity, price, date], (err) => {
      if (err) {
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'Transaction added' });
    }
  );
});

app.listen(5000, () => console.log('Server on port 5000'));


const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to SQLite');
    }
});

// Initialize database tables users, portfolios and transactions
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS portfolios (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, name TEXT, type TEXT, current_value REAL, purchase_price REAL)`);
  db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, asset_name TEXT, type TEXT, quantity REAL, price REAL, date TEXT)`);
});