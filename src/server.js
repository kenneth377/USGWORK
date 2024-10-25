const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path to handle file paths

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
    }
});
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',  // replace with your MySQL username
    password: '1234',  // replace with your MySQL password
    database: 'userdb'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// API endpoint to register a new user with profile picture upload
app.post('/user/reg', upload.single('profile_picture'), async (req, res) => {
    const { name, email, password, phone_number, address, date_of_birth, role } = req.body;
    const profile_picture_url = req.file ? `uploads/${req.file.filename}` : null; // Get file path if uploaded

    if (!name || !email || !password) {
        return res.status(400).json({ responsestatus: "error", message: "Name, email, and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (name, email, password, phone_number, address, profile_picture_url, date_of_birth, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [name, email, hashedPassword, phone_number, address, profile_picture_url, date_of_birth, role], 
        (err) => {
            if (err) {
                console.error('Error during registration:', err);
                return res.status(500).json({ responsestatus: "error", message: "An error occurred during registration" });
            }
            res.json({ responsestatus: "success", message: "User registered successfully" });
        });
    } catch (err) {
        console.error('Server error during registration:', err);
        res.status(500).json({ responsestatus: "error", message: "Server error during registration" });
    }
});

// API endpoint to login a user
app.post('/user/login', (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ responsestatus: "error", message: "Email and password are required" });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ responsestatus: "error", message: "User not found" });
        }

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ responsestatus: "error", message: "Invalid credentials" });
            }

            res.json({ responsestatus: "success", message: "Login successful", user: { id: user.id, name: user.name,email:user.email, role: user.role, profile_picture_url: user.profile_picture_url } });
        } catch (err) {
            res.status(500).json({ responsestatus: "error", message: "Server error during login" });
        }
    });
});

// API endpoint to get all users
app.get('/users', (req, res) => {
    db.query('SELECT id, name, email, role, profile_picture_url FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ responsestatus: "error", message: "An error occurred while retrieving users" });
        }
        res.json({ responsestatus: "success", users: results });
    });
});

// API endpoint to get a specific user by ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT id, name, email, role, phone_number, address, profile_picture_url, date_of_birth FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ responsestatus: "error", message: "User not found" });
        }
        res.json({ responsestatus: "success", user: results[0] });
    });
});

// API endpoint to update user data, including profile picture
app.put('/user/:id', upload.single('profile_picture'), async (req, res) => {
    const userId = req.params.id;
    const { name, email, phone_number, address, date_of_birth } = req.body;
    const profile_picture_url = req.file ? `uploads/${req.file.filename}` : null; // Get file path if uploaded

    // Create query for updating user data
    const updateQuery = 'UPDATE users SET name = ?, email = ?, phone_number = ?, address = ?, date_of_birth = ?, profile_picture_url = ? WHERE id = ?';
    const values = [name, email, phone_number, address, date_of_birth, profile_picture_url, userId];

    db.query(updateQuery, values, (err) => {
        if (err) {
            return res.status(500).json({ responsestatus: "error", message: "Error updating user data" });
        }
        res.json({ responsestatus: "success", message: "User updated successfully" });
    });
});

// Start the server




// API endpoint to get all services
app.get('/services', (req, res) => {
    db.query('SELECT id, name, content, is_running AS isRunning, link_data AS linkdata FROM services', (err, results) => {
        if (err) {
            return res.status(500).json({ responsestatus: "error", message: "An error occurred while retrieving services" });
        }
        res.json({ responsestatus: "success", data: results });
    });
});





// API endpoint to update service status
app.put('/service/:id', (req, res) => {
    console.log("sjs", req.body)
    const serviceId = req.params.id;
    const { isRunning } = req.body; // Expecting to receive the new running state
    db.query('UPDATE services SET is_running = IF(is_running = 1, FALSE, TRUE) WHERE id = ?', [ serviceId], (err) => {
        if (err) {
            return res.status(500).json({ responsestatus: "error", message: "Error updating service status" });
        }
        res.json({ responsestatus: "success", message: "Service status updated successfully" });
    });
});


app.get('/logs', (req, res) => {
    db.query('SELECT id, service_id, user_id, action, reason, timestamp FROM logs', (err, results) => {
        if (err) {
            console.error("Error while retrieving logs:", err); // Log error for debugging
            return res.status(500).json({ 
                responsestatus: "error", 
                message: "An error occurred while retrieving logs. Please try again later."
            });
        }
        res.json({ responsestatus: "success", data: results });
    });
});

// API endpoint to add a new log entry
app.post('/logs', (req, res) => {
    console.log(req.body)
    const { service_id, user_id, action, reason } = req.body;
    const timestamp = new Date(); // Current timestamp

    // Check if required fields are provided
    if (!service_id || !user_id || !action || !reason) {
        return res.status(400).json({ responsestatus: "error", message: "Service ID, User ID, Action, and Reason are required" });
    }

    // SQL query to insert the new log entry
    db.query('INSERT INTO logs (service_id, user_id, action, reason, timestamp) VALUES (?, ?, ?, ?, ?)', 
    [service_id, user_id, action, reason, timestamp], 
    (err) => {
        if (err) {
            console.error('Error adding log:', err);
            return res.status(500).json({ responsestatus: "error", message: "An error occurred while adding the log" });
        }
        res.json({ responsestatus: "success", message: "Log added successfully" });
    });
});


app.get('/scheduled-activities', (req, res) => {
    db.query('SELECT id, user_id, service_id, activity_time, status, created_at, action_type, schedule_reason, service_action FROM scheduled_activities', (err, results) => {
        if (err) {
            console.error("Error while retrieving scheduled activities:", err);
            return res.status(500).json({
                responsestatus: "error",
                message: "An error occurred while retrieving scheduled activities. Please try again later."
            });
        }
        res.json({ responsestatus: "success", data: results });
    });
});


app.post('/scheduled-activities', (req, res) => {
    const { user_id, service_id, activity_time, status, action_type, schedule_reason, service_action } = req.body;
    console.log(req.body)
    // Validate required fields
    if (!user_id || !service_id || !activity_time || !action_type || !schedule_reason || !service_action) {
        return res.status(400).json({
            responsestatus: "error",
            message: "User ID, Service ID, Activity Time, Action Type, Schedule Reason, and Service Action are required"
        });
    }

    // Insert the new scheduled activity
    const query = 'INSERT INTO scheduled_activities (user_id, service_id, activity_time, status, action_type, schedule_reason, service_action) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [user_id, service_id, activity_time, status || 'pending', action_type, schedule_reason, service_action];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Error adding scheduled activity:', err);
            return res.status(500).json({
                responsestatus: "error",
                message: "An error occurred while adding the scheduled activity"
            });
        }
        res.json({ responsestatus: "success", message: "Scheduled activity added successfully" });
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
