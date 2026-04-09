const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 80;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_fallback_secret_123',
    resave: false,
    saveUninitialized: false,
}));

// --- Routes ---

// Default route / Login / Register Form
app.get('/', (req, res) => {
    // If already logged in, redirect
    if (req.session.email) {
        if (req.session.role === 'admin') {
            return res.redirect('/admin_page');
        } else {
            return res.redirect('/user_page');
        }
    }

    const errors = {
        login: req.session.login_error || '',
        register: req.session.register_error || ''
    };
    const activeForm = req.session.active_form || 'login';
    
    // Clear flash session data
    req.session.login_error = null;
    req.session.register_error = null;
    req.session.active_form = null;

    res.render('index', { errors, activeForm });
});

// Register Handling
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Simple validation
    if (!name || !email || !password || !role) {
        req.session.register_error = 'All fields are required';
        req.session.active_form = 'register';
        return res.redirect('/');
    }

    try {
        const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            req.session.register_error = 'Email is already registered';
            req.session.active_form = 'register';
            return res.redirect('/');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, role]);
        
        req.session.active_form = 'login'; // Switch to login form smoothly
        res.redirect('/');
    } catch (err) {
        console.error("Register Error:", err);
        req.session.register_error = 'Registration failed. Please try again.';
        req.session.active_form = 'register';
        res.redirect('/');
    }
});

// Login Handling
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.session.login_error = 'Email and password required';
        req.session.active_form = 'login';
        return res.redirect('/');
    }

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Set session
                req.session.name = user.name;
                req.session.email = user.email;
                req.session.role = user.role;

                if (user.role === 'admin') {
                    return res.redirect('/admin_page');
                } else {
                    return res.redirect('/user_page');
                }
            }
        }
        
        req.session.login_error = 'Incorrect email or password';
        req.session.active_form = 'login';
        res.redirect('/');
    } catch (err) {
        console.error("Login Error:", err);
        req.session.login_error = 'Login failed due to a server error';
        req.session.active_form = 'login';
        res.redirect('/');
    }
});

// Admin Page functionality
app.get('/admin_page', (req, res) => {
    if (!req.session.email) return res.redirect('/');
    if (req.session.role !== 'admin') return res.redirect('/user_page'); // Protect admin page

    res.render('admin_page', { name: req.session.name });
});

// User Page functionality
app.get('/user_page', (req, res) => {
    if (!req.session.email) return res.redirect('/');
    
    res.render('user_page', { name: req.session.name });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// Initialize Database and Start server
db.initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Node app is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Critical: Failed to initialize database:", err);
    // Still start the server so it can show error pages or health check can pass
    app.listen(PORT, () => {
        console.log(`Node app started in error state on port ${PORT}`);
    });
});

