import { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, Text, Button, Image, Pressable, TouchableOpacity } from 'react-native';
import { GiftedChat, Avatar, Send, SystemMessage, Bubble, Message } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import InviteButton from './InviteButton';
import TeamContext from './TeamContext';
import { useUserContext } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FileUpload from '../../components/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import RNFetchBlob from 'rn-fetch-blob';

const firestore = firebase.firestore();
const auth = firebase.auth();

function Chat({navigation}) {

  const { teamId } = useContext(TeamContext);
  const [chatRoomName, setChatRoomName] = useState('');
  const [host, setHost] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const teamsRef = firestore.collection('teams');
    const unsubscribe = teamsRef.doc(teamId).onSnapshot((doc) => {
      setChatRoomName(doc.data().name);
      navigation.setOptions({ 
        title: doc.data().name,
        headerLeft: () => (
          <>
          <Icon
            name="west"
            size={25}
            marginRight={20}
            onPress={() => navigation.pop()}
            />
              </>),
        headerRight: () => (
          <>
            <InviteButton
                style = {styles.block}
                name="person-add"
                onPress={() => navigation.push('InviteFriends')}
              />
            <Icon
            name="logout"
            size={25}
            onPress={exitButton}
            />
          </>   
        ),
      });
    });

    return () => {
      unsubscribe();
    };
  }, [teamId, navigation, host]);

  const currentUser = auth.currentUser; // 현재 로그인한 사용자 정보 가져오기
  const {user} = useUserContext(); // 이걸로 가져오면 현재 유저 아이디, 닉네임, 포토그림 다 가져옴
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
            file: data.file,
            size: data.size,
          };
        });
        setMessages(newMessages);
      });

    return () => {
      unsubscribe();
    };
  }, [teamId]);

  // 채팅방 구성원 가져오기, 방장 구분 하기
  useEffect(() => {
    const chatUsersRef = firestore.collection('teams').doc(teamId).collection('invitedUsers');
    const unsubscribe = chatUsersRef.onSnapshot((querySnapshot) => {
      const newSenders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (doc.id === user.id && data.ishost === true) {
          console.log("채팅방 데이터2:", data)
          setHost(true);
        }
      
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
  }, [teamId, host]);

  // 채팅 보내기
  const onSend = useCallback((newMessages = []) => {
    const chatMessagesRef = firestore.collection('teams').doc(teamId).collection('messages');
    const message = newMessages[0];
    // 일반 메시지 전송
    chatMessagesRef.add({
      text: message.text,
      createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
      user: {
        _id: user.id, // 현재 로그인한 사용자의 UID 사용
        name: user.displayName,
        avatar: user.photoURL,
      },
    });
  }, [teamId, currentUser]);
  
  // 나가기 버튼
  const exitButton = async () => {
    if (host) {
      console.log("나가기 버튼", host);
  
      const deleteCollection = async (collectionRef) => {
        const query = collectionRef.limit(100);
        const querySnapshot = await query.get();
  
        const batchSize = querySnapshot.size;
        if (batchSize === 0) {
          return;
        }
  
        const batch = firestore.batch();
        querySnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
  
        await batch.commit();
        await deleteCollection(collectionRef);
      };
      // 하위 컬렉션 직접 지워야 함. 
      await deleteCollection(firestore.collection('teams').doc(teamId).collection('invitedUsers'));
      await deleteCollection(firestore.collection('teams').doc(teamId).collection('messages'));
      await deleteCollection(firestore.collection('teams').doc(teamId).collection('todos'));
      await firestore.collection('teams').doc(teamId).delete();
      navigation.pop();
    }
    else{
      console.log("방장 아님", host)
      const chatUsersRef = firestore.collection('teams').doc(teamId)
      .collection('invitedUsers')
      .doc(user.id).delete();
      navigation.pop();
    }
  }

   const renderActions = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon  name="add" size={50} color="#0084ff"
         // e로 상태값을 받아왔다. 클릭시 상태값은 !상태값이므로 값이 반전된다 false -> true
         onPress={() => {
          setIsCheck((e) => !e);
        }}/>
      </View>
    );
  };

  const uploadImage = async (url, fileName, user, size) => {
    setIsCheck((e) => !e);
    user = {
      _id: user.id,
      name: user.displayName,
      avatar: user.photoURL,
    };
  
    const message = {
      _id: uuidv4(),
      user,
      text: fileName,
      file: url,
      size: size,
      createdAt: new Date(),
    };
  
    const chatMessagesRef = firestore.collection('teams').doc(teamId).collection('messages');
    try {
      await chatMessagesRef.add({
        createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
        file: message.file,
        text: fileName,
        size: message.size,
        user,
      });
  
      // Add the new message to the current message list.
      // You may need to adjust this part depending on how you handle your state.
    } catch (error) {
      console.log("Error sending message: ", error);
    }
  }
  
  //파일 다운로드 하기
  const downloadFile = async (photoURL, fileName) => {
    const dirs = RNFetchBlob.fs.dirs;
    const localPath = `${dirs.DownloadDir}/${fileName}`;
    
    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        path: localPath,
      }).fetch('GET', photoURL);

      console.log('File downloaded to:', response.path());
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // 파일 용량 변환a
  const sizeConversion = (filesize) => {
    var text = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(filesize) / Math.log(1024));
    return (filesize / Math.pow(1024, e)).toFixed(2) + " " + text[e];
  };
  // message에 파일이 있는 경우
  const renderMessage = (props) => {
    const { currentMessage } = props;
    if (currentMessage.file) {
      const extension = currentMessage.text.split('.');
      // 이미지 파일
      switch (extension[1]) {
        case "png":
        case "jpg":
        case "jpeg":
          return (
            <View style={currentUser.uid === currentMessage.user._id ? 
            { paddingHorizontal: 55, paddingVertical:5, alignItems: "flex-end"}
             : { paddingHorizontal: 55, paddingVertical:5, alignItems: "flex-start" }}>
              <Image 
                source={{uri : currentMessage.file}}
                style={{ width: 200, height: 200 }}
              />
            </View>
          );
        // 나머지 파일
        default:
          return (
            <TouchableOpacity 
              style={currentUser.uid === currentMessage.user._id ? 
                {  width: 250, marginHorizontal: 20, padding: 20, paddingVertical:5, marginVertical: 5, alignItems: "flex-end" }
                : { width: 250, backgroundColor:'white', marginHorizontal: 20, padding: 20, paddingVertical:5, marginVertical: 5, alignItems: "flex-start"}}
              onPress={() => downloadFile(currentMessage.file, currentMessage.text, currentMessage.size)}>
              <View style={{ alignItems: 'center', flexDirection: 'row'}}>
                <Image 
                  source={require('../../assets/images/fileImg.png')}
                  style={{ width: 35, height: 35}}
                />
                <View style={{ flexDirection: 'column', padding: 10, width: 200}}>
                  <Text style={{ fontWeight: 'bold'}}>{currentMessage.text}</Text>
                  <Text>용량 : {sizeConversion(currentMessage.size)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
      }
    } 
    return <Message {...props} />;
  };
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        renderActions={renderActions}
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
        renderMessage={renderMessage}
        listViewProps={{
          style: {
            backgroundColor: '#f0f0f0',
          },
        }}
        
        
        //renderUsernameOnMessage={true}
        renderAvatar={(props) => {
          //console.log("props : ",props)
          const sender = senders.find((s) => s._id === props.currentMessage.user._id);
          if (!sender) {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar {...props} name="알 수 없음" />
              </View>
            );
          }
          if (sender._id === currentUser.uid) {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar {...props} name="나"/>
              </View>
              );
          } else {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar {...props} avatar={sender.avatar} />
            </View>
            );
          }
        }}
        // 채팅 보내기
        renderSend={(props) => {
          return (
            <Send {...props}>
              <View style={{ marginRight: 10, marginBottom: 5 }}>
                <Icon name="send" size={32} color="#0084ff" />
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
          const currentMessageUserId = props.currentMessage.user._id;
          const previousMessageUserId = props.previousMessage.user?._id;
          const shouldDisplayUsername =
          currentMessageUserId !== previousMessageUserId;

          const sender = senders.find((s) => s._id === props.currentMessage.user._id);
          const displayName = sender === currentUser.uid ? "나" : sender?.name || props.currentMessage.user.name;
  
          return (
            <View>
              {shouldDisplayUsername && (
                <Text
                  style={
                    currentMessageUserId === currentUser.uid
                      ? { textAlign: "right", marginRight: 5, marginBottom: 16 }
                      : { marginLeft: 5, marginBottom: 16 }
                  }
                >
                  {displayName}
                </Text>
              )}
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: '#a7cfdf',
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
          
            </View>
          );
        }}
        placeholder={`메시지 보내기 (${chatRoomName})`}
      />
      {isCheck && (
        <FileUpload onClick={uploadImage} teamId={teamId}/>
      )}      
    </View>
  );
}


const styles = StyleSheet.create({
  block: {
    marginRight: 16,
  },
});

export default Chat;