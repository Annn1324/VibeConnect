process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(error.name, error.message);
    process.exit(1);
});

const app = require('./src/app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

process.on('unhandledRejection', (error) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});
