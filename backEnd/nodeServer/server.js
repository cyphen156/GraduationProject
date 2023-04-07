//모듈임포트
const express = require('express');
const mysql = require('mysql');

//앱 선언, 사용할 포트
const app = express();
const port = 3000;

//db연결 세팅
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chatdb'
});
//db연결
connection.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

//함수 선언
app.use((request, response) => {
  response.send('<h1>HelloWofdsdfsdf</h1>');
});



// 라우팅경로 정의
app.get('/chat', (req, res) => {
  // Select all chat messages from the database
  connection.query('SELECT * FROM chat', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
/*
// Use body-parser middleware
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});