import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import { auth } from '@react-native-firebase/auth';

const firestore = firebase.firestore();
const chatMessagesRef = firestore.collection('chatMessages');
const recipientId = 'qwe';
function chat() {
  const [messages, setMessages] = useState([]);

  const [currentUser, setCurrentUser] = useState([]);
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const unsubscribe = chatMessagesRef
      .where('recipientId', '==', recipientId)
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
      unsubscribeAuth();
      unsubscribe();
    };
  }, [recipientId]);
 
  const onSend = useCallback((newMessages = []) => {
    if (!currentUser) {
      return;
    }

    const message = newMessages[0];
    chatMessagesRef.add({
      text: message.text,
      createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
      user: { ...message.user, _id: currentUser.uid },
      recipientId,
    });
  }, [currentUser, recipientId]);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: currentUser ? currentUser.uid : null }}
        inverted={true}
      />
    </View>
  );
}

export default chat;