process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(error.name, error.message);
    process.exit(1);
});

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (error) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});
