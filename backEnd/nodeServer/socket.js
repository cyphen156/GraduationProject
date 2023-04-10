//모듈 선언
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A new user has connected!');

  socket.on('fetch_messages', () => {
    // Fetch messages from MySQL database
    connection.query('SELECT * FROM messages', (err, results) => {
      if (err) throw err;
      socket.emit('initial_messages', results);
    });
  });

  socket.on('send_message', (message) => {
    // Save message to MySQL database
    connection.query(
      'INSERT INTO messages (user_id, text) VALUES (?, ?)',
      [message.user._id, message.text],
      (err) => {
        if (err) throw err;
        io.emit('new_message', [message]);
      },
    );
  });
});
