const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();



//------------------------
const passport = require('./config/passport');
//------------------------




// Middleware
app.use(cors());
app.use(express.json());



//------------------------
app.use(passport.initialize());
//------------------------




// Serving Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Add specific routes for images if needed (though express.static covers it)
// /uploads/profile-images/...

// Routes
//------------------------
app.use('/auth',require('./routes/googleAuthRoutes'));
//------------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/communities', require('./routes/communityRoutes'));
app.use('/api/votes', require('./routes/voteRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Dashboard route
const { getDashboard } = require('./controllers/userController');
const { protect } = require('./middleware/authMiddleware');
app.get('/api/dashboard', protect, getDashboard);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON Parsing Error:', err.message);
        return res.status(400).json({ success: false, error: 'Invalid JSON format' });
    }
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "https://threadmydoubt.vercel.app",
        methods: ["GET", "POST"],
        credentials:true
    }
});

//  Store io globally
app.set("io", io);

//  Handle connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join question room
    socket.on("joinQuestion", (questionId) => {
        socket.join(questionId);
        console.log(`User joined room: ${questionId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

//  Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
















const Community = require('./models/Community');

(async () => {
    const communities = await Community.find();

    for (let c of communities) {
        if (!c.slug) {
            c.slug = c.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            await c.save();
            console.log("Updated:", c.slug);
        }
    }
})();