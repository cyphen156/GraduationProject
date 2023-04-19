import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { useEffect } from 'react';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';

const CreateTeamScreen = ({ navigation }) => {

useEffect(() => {
  navigation.setOptions({
      title: 'CreateTeam', headerTitleAlign: 'center',
      headerLeft: () => (
          <>
          <IconLeftButton
              name="Profile"
              onPress={() => navigation.navigate('Profile')
            }
              />
              </>),
      headerRight: () => (
          <>
          <IconRightButton
              name="search"
              onPress={() => navigation.navigate('FriendsList')}
              />
          <IconRightButton
              name="person-add"
              onPress={() => navigation.navigate('FriendsAdd')}
              />
          <IconRightButton
              name="settings"
              onPress={() => navigation.navigate('Setting')}
              />      
           </>   
      ),
  });
  },[navigation])

  const [teamName, setTeamName] = useState('');

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
        navigation.navigate('Chat', { teamId: docRef.id });
      })
      .catch(error => {
        console.error(error);
      });
      
  };

  return (
    <View>
      <TextInput
        placeholder="Team name"
        value={teamName}
        onChangeText={setTeamName}
      />
      <Button title="Create Team" onPress={handleCreateTeam} />
    </View>
  );
};

export default CreateTeamScreen;
