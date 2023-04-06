const express = require('express');
const app = express();

app.use((request, response) => {
  response.send('<h1>HelloWorld</h1>');
  response.send('<h1>HelloWorld</h1>');
});

app.listen(8080, () => {
  console.log("serverStarted");
});

//채팅서버 예제
/*
// Import required modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create a new Express application
const app = express();

// Set up the database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chatdb'
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// Use body-parser middleware
app.use(bodyParser.json());

// Define the routes
app.get('/chat', (req, res) => {
  // Select all chat messages from the database
  connection.query('SELECT * FROM chat', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/chat', (req, res) => {
  // Insert a new chat message into the database
  const { user, message } = req.body;
  connection.query('INSERT INTO chat (user, message) VALUES (?, ?)', [user, message], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, user, message });
  });
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));
*/