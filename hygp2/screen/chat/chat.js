import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { GiftedChat, Avatar, Send, SystemMessage, Bubble } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const firestore = firebase.firestore();
const auth = firebase.auth();

function Chat({ chatRoomName }) {
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState([]);
  const currentUser = auth.currentUser; // 현재 로그인한 사용자 정보 가져오기

  useEffect(() => {
    const chatMessagesRef = firestore.collection('chatRooms').doc(chatRoomName).collection('messages');
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
  }, [chatRoomName]);

  useEffect(() => {
    const chatUsersRef = firestore.collection('chatRooms').doc(chatRoomName).collection('users');
    const unsubscribe = chatUsersRef.onSnapshot((querySnapshot) => {
      const newSenders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          name: data.name,
          avatar: data.avatar,
        };
      });
      setSenders(newSenders);
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomName]);

  const onSend = useCallback((newMessages = []) => {
    const chatMessagesRef = firestore.collection('chatRooms').doc(chatRoomName).collection('messages');
    const message = newMessages[0];
    chatMessagesRef.add({
      text: message.text,
      createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
      user: {
        _id: currentUser.uid, // 현재 로그인한 사용자의 UID 사용
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    });
  }, [chatRoomName, currentUser]);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUser.uid,
          name: currentUser.displayName,
          avatar: currentUser.photoURL,
        }}
        inverted={true}
        renderAvatarOnTop={true}
        showUserAvatar={true}
        messagesContainerStyle={{ backgroundColor: '#f0f0f0' }}
        listViewProps={{
          style: {
            backgroundColor: '#f0f0f0',
          },
        }}
        renderUsernameOnMessage={true}
        renderAvatar={(props) => {
          const sender = senders.find((s) => s._id === props.currentMessage.user._id);
          if (sender._id === currentUser.uid) {
            return <Avatar {...props} name="나" />;
          } else {
            return <Avatar {...props} avatar={sender.avatar} />;
          }
        }}
        renderSend={(props) => {
          return (
            <Send {...props}>
              <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Ionicons name="ios-send" size={32} color="#0084ff" />
              </View>
            </Send>
          );
        }}
        renderSystemMessage={(props) => {
          return (
            <SystemMessage
              {...props}
              textStyle={{ color: '#f0f0f0' }}
            />
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: '#f0f0f0',
                },
                right: {
                  backgroundColor: '#0084ff',
                },
              }}
              textStyle={{
                left: {
                  color: '#000',
                },
                right: {
                  color: '#fff',
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};
export default Chat;