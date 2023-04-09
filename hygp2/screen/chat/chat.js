import { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch initial chat messages
    socket.emit('fetch_messages');

    // Listen for new messages
    socket.on('new_message', (message) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message),
      );
    });
  }, []);

  const onSend = (newMessages = []) => {
    socket.emit('send_message', newMessages[0]);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: 1,
      }}
    />
  );
}

export default chat;