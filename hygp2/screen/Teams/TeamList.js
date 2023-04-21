import { useContext, useEffect, useState } from 'react';
import { View, FlatList, Button, Pressable , StyleSheet , Text} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import TeamContext from './TeamContext';
import IconLeftButton from '../../components/IconLeftButton';
import IconRightButton from '../../components/IconRightButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../MyProfileScreen';
import TeamStackNavigator from './TeamStack';

const Stack = createNativeStackNavigator();

const TeamListScreen = ({ navigation }) => { 
  useEffect(() => {
    navigation.setOptions({
        title: 'TeamList', headerTitleAlign: 'center',
        headerLeft: () => (
            <>
            <IconLeftButton
                name="Profile"
                onPress={() => navigation.navigate('Profile')
              }
                />
                </>),
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
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
             </View>   
        ),
    });
    },[navigation])
   

  const [teams, setTeams] = useState([]);
  const { teamId, setTeamId  } = useContext(TeamContext);

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
      <Pressable style={styles.itemContainer}
      onPress={() => {
        setTeamId(item.id);
        navigation.push("SubTab", { 
          screen: 'TeamStackNavigator', 
          params:{ 
            screen: 'Chat' }});
      }}>
        <View>
          <Text style={styles.teamName}>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.teamName}>그룹 방</Text>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});


export default TeamListScreen;
