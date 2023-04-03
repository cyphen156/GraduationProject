import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const CreateTeamScreen = () => {
  const [teamName, setTeamName] = useState('');

  const handleCreateTeam = () => {
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('teams').add({
      name: teamName,
      createdBy: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(docRef => {
        // Team has been created
      })
      .catch(error => {
        // Handle create team error
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
