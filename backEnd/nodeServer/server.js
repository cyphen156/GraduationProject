//모듈임포트
const express = require('express'); //express 웹 서버 생성
const morgan = require('morgan'); //로그 기록
const http = require('http'); //http
const cors = require('cors'); //client ajex 요청 다중서버 접속
const firebase = require("firebase/app");
require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOWnBCSHjMGCGF1EUycGntildV844uUSM",
  authDomain: "hygp2-ec607.firebaseapp.com",
  projectId: "hygp2-ec607",
  storageBucket: "hygp2-ec607.appspot.com",
  messagingSenderId: "603930050293",
  appId: "1:603930050293:web:4acfa6e947d76587bacfbc",
  measurementId: "G-YV0BZHL37W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Create a Firestore reference
const firestore = firebase.firestore();


//앱 선언, 사용할 포트
const app = express();
const port = 3000;
const server = http.createServer(app);
app.use(cors());

//함수 선언
app.use(morgan('dev'));
app.use((request, res) => {
  res.send('<h1>HelloWdfdf</h1>');
});

// 로그 기록
if (process.env.NODE_ENV === 'production') { 
   app.use(morgan('combined')); // 배포환경
} else {
   app.use(morgan('dev')); // 개발환경
}

// Set up API routes
const router = express.Router();

// Set up the API routes
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the chat app API' });
});

router.get('/messages', async (req, res) => {
  try {
    const messages = [];
    const snapshot = await firestore
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        message: doc.data().message,
        timestamp: doc.data().timestamp.toDate(),
      });
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.use('/api', router);

////소켓
//소켓 모듈 선언
const socketIO = require('socket.io');
const io = socketIO(server);

//io리스너 이벤트 설정
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for new chat messages
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);

    // 콜렉션 저장
    firestore.collection('messages').add({
      message: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // 클라이언트에게 메세지 전송
    io.emit('chat message', msg);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});




server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});