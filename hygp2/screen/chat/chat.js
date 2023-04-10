import { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const port = 'http://localhost:3000'
const socket = io(port);

function chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
     // Connect to the server
     const socket = io(SERVER_URL);
     setSocket(socket);
 
     // Listen for new chat messages
     socket.on('chat message', (msg) => {
       const newMessage = {
         _id: msg.id,
         text: msg.message,
         createdAt: new Date(msg.timestamp),
         user: {
           _id: 2,
           name: 'React Native',
           avatar: 'https://placeimg.com/140/140/any',
         },
       };
       setMessages((prevMessages) => [newMessage, ...prevMessages]);
     });
 
     // Disconnect event
     return () => {
       socket.disconnect();
     };
   }, []);
 
   const onSend = (newMessages = []) => {
     // Send the chat message to the server
     const message = newMessages[0];
     socket.emit('chat message', message.text);
 
     // Add the message to the local state
     const newMessage = {
       _id: message._id,
       text: message.text,
       createdAt: message.createdAt,
       user: message.user,
     };
     setMessages((prevMessages) => [newMessage, ...prevMessages]);
   };
   return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        inverted={true}
      />
    </View>
  );
}

export default chat;