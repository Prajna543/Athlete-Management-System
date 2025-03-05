const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../athlete-frontend')));

// ✅ Session Handling (To store user info after login)
app.use(session({
    secret: 'athleteSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));

// ✅ Serve HTML Pages
const sendHTML = (file, res) => res.sendFile(path.join(__dirname, '../athlete-frontend', file));

app.get('/competitions', (req, res) => sendHTML('competetions.html', res));
app.get('/injury', (req, res) => sendHTML('injury.html', res));
app.get('/finance', (req, res) => sendHTML('finance.html', res));
app.get('/profile', (req, res) => sendHTML('profile.html', res));
app.get('/dashboard-athlete', (req, res) => sendHTML('dashboard-athlete.html', res));
app.get('/dashboard-organizer', (req, res) => sendHTML('dashboard-organizer.html', res));

// ✅ Handle `/dashboard` Route (Redirects Based on User Role)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    const redirectUrl = req.session.user.role === "athlete" ? "/dashboard-athlete" : "/dashboard-organizer";
    res.redirect(redirectUrl);
});

// ✅ Dummy User Storage (Replace with Database Later)
let users = [];
let athleteProfile = { athleteName: "John Doe", age: 25, sport: "Running" };

// ✅ Signup API
app.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: "Email already registered." });
    }

    console.log(`User Signed Up: Name: ${name}, Email: ${email}, Role: ${role}`);
    users.push({ name, email, password, role });

    res.status(200).json({
        success: true,
        message: "Signup successful!",
        redirectUrl: role === "athlete" ? "/dashboard-athlete" : "/dashboard-organizer"
    });
});

// ✅ Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login Attempt: Email: ${email}`);

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    req.session.user = user;
    res.status(200).json({
        success: true,
        message: "Login successful!",
        redirectUrl: user.role === "athlete" ? "/dashboard-athlete" : "/dashboard-organizer"
    });
});

// ✅ Logout API
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ success: true, message: "Logged out successfully!" });
});

// ✅ Get Athlete Profile
app.get('/get-profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }
    res.json(athleteProfile);
});

// ✅ Update Athlete Profile
app.post('/update-profile', (req, res) => {
    const { athleteName, age, sport } = req.body;

    if (!athleteName || !age || !sport) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    athleteProfile = { athleteName, age, sport };
    console.log("Profile Updated:", athleteProfile);
    res.status(200).json({ success: true, message: "Profile updated successfully!" });
});

// ✅ Dummy Competitions Storage (Replace with Database Later)
let competitions = [];

// ✅ Add a Competition (Organizer)
app.post('/api/competitions', (req, res) => {
    const { competitionName, date, location } = req.body;

    if (!competitionName || !date || !location) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newCompetition = { name: competitionName, date, location };
    competitions.push(newCompetition);
    console.log("Competition Added:", newCompetition);

    res.json({ success: true, message: "Competition added successfully!", competition: newCompetition });
});

// ✅ Get Competitions (Athlete)
app.get('/api/competitions', (req, res) => {
    res.json({ competitions });
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
