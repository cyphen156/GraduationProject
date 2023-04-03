import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

const TeamListScreen = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const user = firebase.auth().currentUser;

    const unsubscribe = firebase.firestore()
      .collection('teams')
      .where('createdBy', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const teams = [];
        querySnapshot.forEach(doc => {
          teams.push({ id: doc.id, ...doc.data() });
        });
        setTeams(teams);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.name}</Text>
        <Text>Created at: {item.createdAt.toDate().toDateString()}</Text>
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
