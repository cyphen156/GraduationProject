import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const firestore = firebase.firestore();
const chatMessagesRef = firestore.collection('chatMessages');

function chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = chatMessagesRef
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
          };
        });
        setMessages(newMessages);
      });

    return () => {
      unsubscribe();
    };
  }, []);
 
  const onSend = useCallback((newMessages = []) => {
    const message = newMessages[0];
    chatMessagesRef.add({
      text: message.text,
      createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
      user: message.user,
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
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