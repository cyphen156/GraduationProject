import { useContext, useEffect, useState } from 'react';
import { View, FlatList, Button, Pressable , StyleSheet , Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import TeamContext from './TeamContext';
import IconLeftButton from '../../components/IconLeftButton';
import IconRightButton from '../../components/IconRightButton';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../MyProfileScreen';
import TeamStackNavigator from './TeamStack';
import FloatingWriteButton from '../../components/FloatingWriteButton';
import TeamCreateButton from '../../components/TeamCreateButton';
import Avatar from "../../components/Avatar";
import { useUserContext } from "../../context/UserContext";


const Stack = createNativeStackNavigator();

const TeamListScreen = ({ navigation }) => {

  const {user} = useUserContext();
  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: () => (
        <>
          <Pressable style={styles.profile}  onPress={() => navigation.push('Profile')}>
            <Avatar source={user.photoURL && {uri: user.photoURL}} size={38} />
          </Pressable>
        </>
      ),
      headerRight: () => (
        <View style={styles.settings}>
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
  }, [navigation]);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { teamId, setTeamId } = useContext(TeamContext);

  const refresh = useEffect(() => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigation, teams]);

  useEffect(() => {
  
    const unsubscribe = navigation.addListener('focus', () => {
      // 데이터 다시 불러오기
      refresh;
    });
  
    return unsubscribe;
  }, [navigation]);
  
  const renderItem = ({ item }) => {
    console.log("itme", item)
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setTeamId(item.id);
          navigation.push('SubTab', {
            screen: 'TeamStackNavigator',
            params: {
              screen: 'Chat',
            },
          });
        }}
      >
        <View> 
          <Text style={styles.group}>{item.name}</Text>
          <Text style={{padding:5}}>{item.discription}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [hidden, setHidden] = useState(false);

  const onScrolledToBottom = (isBottom) => {
      if (hidden != isBottom) {setHidden(isBottom)};
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.teamName}>그룹 방</Text>
      <FlatList data={teams} renderItem={renderItem} 
        keyExtractor={item => item.id} 
        onScrolledToBottom={onScrolledToBottom}/>
        <TeamCreateButton hidden={hidden} />
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
  group: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    padding: 5,
  },
  block: {
    flex: 1,
    zIndex: 0,
  },
  profile: {
    marginLeft: 16,
  },
  settings : {
    marginRight: 16,
    flexDirection: 'row',
  }
});


export default TeamListScreen;
