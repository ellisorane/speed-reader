const path = require('path');
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Allows for req.body use
app.use(express.json({ extended: false }));

// Below are needed to access the uploaded avatar files 
app.use('/static', express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/texts', require('./routes/api/texts'));
app.use('/api/comments', require('./routes/api/comments'));

// For Heroku deploy
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('/*', (req, res) => {
        // res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), (err) => {
            if(err) {
                res.status(500).send(err);
            }
        });
    });
}

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));