
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

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
    'https://thread-my-doubt.vercel.app',
    'https://threadmydoubt.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

const isOriginAllowed = (origin) => {
    // Allow requests without an origin (curl, mobile apps, server-to-server)
    if (!origin) return true;

    const normalizedOrigin = origin.trim().replace(/\/$/, '');

    // Allow explicitly configured frontend origins
    if (allowedOrigins.includes(normalizedOrigin)) return true;

    // Allow CLIENT_URL from Render environment variables (supports comma-separated URLs)
    if (process.env.CLIENT_URL) {
        const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, ''));
        if (clientUrls.includes(normalizedOrigin)) return true;
    }

    // Allow any Vercel preview or production deployment domain
    if (
        /^https:\/\/(thread-my-doubt|threadmydoubt)[a-z0-9-]*\.vercel\.app$/.test(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app')
    ) {
        return true;
    }

    // Allow localhost during development
    if (
        process.env.NODE_ENV !== 'production' &&
        (normalizedOrigin.startsWith('http://localhost:') || normalizedOrigin.startsWith('http://127.0.0.1:'))
    ) {
        return true;
    }

    return false;
};

const corsOptions = {
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            callback(null, true);
        } else {
            console.warn('Blocked Express CORS origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
};

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors(corsOptions));

app.use(express.json());

app.use(passport.initialize());

// Serving static files
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

// ==========================================
// API ROUTES
// ==========================================

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

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ThreadMyDoubt API is running',
        environment: process.env.NODE_ENV
    });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// JSON parsing and other application errors
app.use((err, req, res, next) => {
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        'body' in err
    ) {
        console.error('JSON Parsing Error:', err.message);

        return res.status(400).json({
            success: false,
            error: 'Invalid JSON format'
        });
    }

    console.error('Application Error:', err.message);

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// ==========================================
// HTTP SERVER & SOCKET.IO
// ==========================================

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isOriginAllowed(origin)) {
                callback(null, true);
            } else {
                console.warn('Blocked Socket.IO CORS origin:', origin);
                callback(null, false);
            }
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Store Socket.IO instance globally on app
app.set('io', io);

// Socket.IO connection handler
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
io.engine.on("connection_error", (err) => {
    console.log("SOCKET CONNECTION ERROR");

    console.log("Code:", err.code);
    console.log("Message:", err.message);
    console.log("Context:", err.context);
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });
});
// ==========================================
// SERVER CONFIGURATION
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// START SERVER AFTER DATABASE CONNECTION
// ==========================================

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log('MongoDB connected successfully');

        // Safe community slug backfill
        try {
            const communities = await Community.find();

            for (const community of communities) {
                if (!community.slug) {
                    community.slug = community.name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');

                    await community.save();

                    console.log(
                        'Updated community slug:',
                        community.slug
                    );
                }
            }
        } catch (slugError) {
            console.error(
                'Community slug initialization warning:',
                slugError.message
            );
        }

        // Start HTTP server
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('Socket.IO server initialized');
        });

    } catch (err) {
        console.error(
            'Server startup failed:',
            err.message
        );

        process.exit(1);
    }
};

startServer();
