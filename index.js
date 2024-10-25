
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Setup session middleware
app.use(session({
    secret: 'yourSecretKey', // Replace with a random secret key
    resave: false,
    saveUninitialized: true,
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mini_blog'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Hardcoded admin credentials (for simplicity)
const adminUsername = 'admin';
const adminPassword = 'password123'; // You can change this password

// Admin login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        res.redirect('/admin.html');
    } else {
        res.send('Invalid credentials');
    }
});

// Middleware to check if admin is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

// Route to post a new blog (protected route)
app.post('/api/blogs', isAuthenticated, (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO blogs (title, content) VALUES (?, ?)';
    db.query(sql, [title, content], (err, result) => {
        if (err) throw err;
        res.redirect('/admin.html');
    });
});

// Route to fetch all blogs
app.get('/api/blogs', (req, res) => {
    const sql = 'SELECT * FROM blogs ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to get a single blog by ID
app.get('/api/blogs/:id', (req, res) => {
    const blogId = req.params.id;
    const sql = 'SELECT * FROM blogs WHERE id = ?';
    
    db.query(sql, [blogId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json(result[0]);  // Return the first blog found
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    });
});

// New route for user to post a blog without authentication
app.post('/api/user-blogs', (req, res) => {
    const { username, title, content } = req.body; // Destructure username, title, and content from the request body
    const sql = 'INSERT INTO blogs (username, title, content) VALUES (?, ?, ?)';
    
    db.query(sql, [username, title, content], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Blog posted successfully!', blogId: result.insertId });
    });
});



// Route to serve admin page (only for authenticated users)
app.get('/admin.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
