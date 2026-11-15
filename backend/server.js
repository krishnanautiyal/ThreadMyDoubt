const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const passport = require('./config/passport');
const testRoutes = require('./routes/testRoutes');
const Community = require('./models/Community');
const { getDashboard } = require('./controllers/userController');
const { protect } = require('./middleware/authMiddleware');

const app = express();

// Allowed Origins for CORS
const defaultOrigins = [
    'https://threadmydoubt.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

const isOriginAllowed = (origin) => {
    if (!origin) return true; // Mobile apps, curl, server-to-server
    if (defaultOrigins.includes(origin)) return true;
    if (origin.endsWith('.vercel.app')) return true;
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return true;
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) return true;
    return false;
};

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow requests while supporting credentials
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// Serving Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/test', testRoutes);
app.use('/auth', require('./routes/googleAuthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/communities', require('./routes/communityRoutes'));
app.use('/api/votes', require('./routes/voteRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Dashboard route
app.get('/api/dashboard', protect, getDashboard);

// Basic health route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// JSON Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON Parsing Error:', err.message);
        return res.status(400).json({ success: false, error: 'Invalid JSON format' });
    }
    next();
});

// Create HTTP Server & Socket.io
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isOriginAllowed(origin)) {
                callback(null, true);
            } else {
                callback(null, true);
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Store io instance globally on app
app.set('io', io);

// Socket.io Connection Handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinQuestion', (questionId) => {
        socket.join(questionId);
        console.log(`User joined room: ${questionId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// Start Server after database connection
const startServer = async () => {
    try {
        await connectDB();

        // Safe community slug backfill
        try {
            const communities = await Community.find();
            for (let c of communities) {
                if (!c.slug) {
                    c.slug = c.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                    await c.save();
                    console.log('Updated community slug:', c.slug);
                }
            }
        } catch (slugError) {
            console.error('Community slug initialization warning:', slugError.message);
        }

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Server startup failed:', err.message);
        process.exit(1);
    }
};

startServer();
