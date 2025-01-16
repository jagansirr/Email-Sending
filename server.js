require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Handle client connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendEmail', (data) => {
        const mailOptions = {
            from: process.env.EMAIL,
            to: data.to,
            subject: data.subject,
            text: data.message,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                socket.emit('emailStatus', { success: false, message: 'Failed to send email' });
            } else {
                console.log('Email sent: ' + info.response);
                socket.emit('emailStatus', { success: true, message: 'Email sent successfully!' });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
