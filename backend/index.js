require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' })); 

app.get('/', (req, res) => res.send('Backend running'));
app.listen(5000, () => console.log('Server on port 5000'));
