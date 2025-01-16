const socket = io();

document.getElementById('emailForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const to = document.getElementById('to').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    socket.emit('sendEmail', { to, subject, message });

    socket.on('emailStatus', (status) => {
        const statusElement = document.getElementById('status');
        if (status.success) {
            statusElement.textContent = status.message;
            statusElement.style.color = 'green';
        } else {
            statusElement.textContent = status.message;
            statusElement.style.color = 'red';
        }
    });
});
