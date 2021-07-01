const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Running....'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/texts', require('./routes/api/texts'));

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));