import { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { useEffect } from 'react';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';

const CreateTeamScreen = ({ navigation }) => {

useEffect(() => {
  navigation.setOptions({
      title: '팀 생성', headerTitleAlign: 'center',
      
  });
  },[navigation])

  const [teamName, setTeamName] = useState('');
  const [teamBody, setTeamBody] = useState('');

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a valid team name');
      return;
    }
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('teams').add({
      name: teamName,
      createdBy: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(docRef => {
        firebase.firestore().collection(`teams/${docRef.id}/messages`);
        const invitedUsersRef = firebase.firestore().collection(`teams/${docRef.id}/invitedUsers`);
        invitedUsersRef.doc(user.uid).set({
          [user.uid]: true
        });
        //navigation.navigate('Chat', { teamId: docRef.id });
        navigation.navigate('TeamList');
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
        onChangeText={setTeamBody}
        style={styles.body}
        multiline
        textAlignVertical="top"
      />
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
    textDecorationLine: 'line-through',
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
