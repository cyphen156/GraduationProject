import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';
import { useUserContext } from '../../context/UserContext';

const CreateTeamScreen = ({ navigation }) => {
  const [isHashtagMode, setHashtagMode] = useState(false);
  const [hashtag, setHashtag] = useState('');

  const handleTeamBodyChange = (text) => {
    setTeamBody(text);

    if (text.endsWith('#')) {
      setHashtagMode(true);
    } else if (isHashtagMode && text.endsWith(' ')) {
      // 해시태그 모드
      setHashtagMode(false);
      setHashtag('');
    } else if (isHashtagMode) {
      setHashtag(text.split('#').pop());
    }
  };

useEffect(() => {
  navigation.setOptions({
      title: '팀 생성', headerTitleAlign: 'center',
      
  });
  },[navigation])

  const [teamName, setTeamName] = useState('');
  const [teamBody, setTeamBody] = useState('');
  const { user } = useUserContext();
  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a valid team name');
      return;
    }

    const hashtags = teamBody.match(/(#[가-힣a-zA-Z0-9_]+)/g) || [];

    firebase.firestore().collection('teams').add({
      name: teamName,
      discription: teamBody, hashtags,
      createdBy: user.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(async docRef => {
        const messagesRef = firebase.firestore().collection(`teams/${docRef.id}/messages`);
        const invitedUsersRef = firebase.firestore().collection(`teams/${docRef.id}/invitedUsers`);
        await invitedUsersRef.doc(user.id).set({
          userData: {
            id: user.id,
            displayName: user.displayName,
            //email: user.email,
            photoURL: user.photoURL
          },
          ishost: true
        });
        await messagesRef.add({
          text: "팀이 생성되었습니다.",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          user: {
            id: user.id,
            displayName: user.displayName,
            //email: user.email,
            photoURL: user.photoURL
          }
        });
        //navigation.navigate('Chat', { teamId: docRef.id });
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
      
  };

  return (
    <View style={styles.block}>
      <TextInput 
        placeholder="Team name"
        value={teamName}
        onChangeText={setTeamName}
        style={styles.title}
      />
      <TextInput
        placeholder="Team 설명"
        value={teamBody}
        onChangeText={handleTeamBodyChange}
        style={styles.body}
        multiline
        textAlignVertical="top"
      />
      {isHashtagMode && <Text>현재 해시태그 입력 모드: {hashtag}</Text>}
      <Button title="Create Team"
       onPress={handleCreateTeam}
       style={styles.button} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    padding: 16,     
    backgroundColor: '#fafafa',
    borderColor: '#00000' 
  },
  title: {
    paddingVertical: 0,
    fontSize: 18,
    marginBottom: 16,
    color: '#263238',
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: '#263238',
  },
  button: {
    height: '20%'
  }
});

export default CreateTeamScreen;
