import { useEffect, useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const TeamListScreen = ({ navigation }) => { 
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const teamsRef = firebase.firestore().collection('teams');
  
    const unsubscribe = teamsRef.onSnapshot(async querySnapshot => {
      const teams = [];
  
      for (const doc of querySnapshot.docs) {
        const invitedUsersRef = doc.ref.collection('invitedUsers').doc(user.uid);
        const invitedUser = await invitedUsersRef.get();
        
        if (invitedUser.exists) {
          teams.push({ id: doc.id, ...doc.data() });
        }
      }
  
      setTeams(teams);
    });
  
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Button
          title={item.name}
          onPress={() => navigation.navigate('Chat', { teamId: item.id })}
          />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default TeamListScreen;