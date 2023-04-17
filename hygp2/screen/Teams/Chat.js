import { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet} from 'react-native';
import { GiftedChat, Avatar, Send, SystemMessage, Bubble } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InviteButton from './InviteButton';
import TeamContext from './TeamContext';

const firestore = firebase.firestore();
const auth = firebase.auth();

function Chat({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [chatRoomName, setChatRoomName] = useState('');

  useEffect(() => {
    const teamsRef = firestore.collection('teams');
    const unsubscribe = teamsRef.doc(teamId).onSnapshot((doc) => {
      setChatRoomName(doc.data().name);
      navigation.setOptions({ 
        title: doc.data().name,
        headerRight: () => (
          <>
            <InviteButton
                style = {styles.block}
                name="person-add"
                onPress={() => navigation.push('InviteFriends')}
               />
          </>   
        ),
      });
    });

    return () => {
      unsubscribe();
    };
  }, [teamId, navigation]);

  const currentUser = auth.currentUser; // 현재 로그인한 사용자 정보 가져오기
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState([]);

  // 채팅 메세지 가져오기
  useEffect(() => {
    const chatMessagesRef = firestore.collection('teams').doc(teamId).collection('messages');
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
  }, [teamId]);

  // 채팅방 구성원 가져오기
  useEffect(() => {
    const chatUsersRef = firestore.collection('teams').doc(teamId).collection('invitedUsers');
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
  }, [teamId]);

  const onSend = useCallback((newMessages = []) => {
    const chatMessagesRef = firestore.collection('teams').doc(teamId).collection('messages');
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
  }, [teamId, currentUser]);

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
        placeholder={`메시지 보내기 (${chatRoomName})`}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  block: {
    marginRight: 16,
  },
});

export default Chat;