import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const CreateTeamScreen = ({ navigation }) => {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = () => {
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
