import { useState, useEffect, useContext} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, Button, ActivityIndicator } from 'react-native';
import { friendIdSearch } from '../lib/friends';
import { fromIdtoUser, getUserId } from '../lib/user';
import { useUserContext } from '../../context/UserContext';
import Avatar from '../../components/Avatar';
import {useNavigation, useNavigationState} from '@react-navigation/native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RNBounceable from "@freakycoder/react-native-bounceable";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import TeamContext from './TeamContext';

const firestore = firebase.firestore();

const InviteFriends = () => {
  console.log("InviteFriends");
  const { teamId } = useContext(TeamContext);
  const { user, setUser } = useUserContext();
  const [friendArray, setFriendArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [idDoc, setIddoc] = useState([]);
  let data = [];
  const navigation = useNavigation();
  const [usersToInvite, setUsersToInvite] = useState([]);

  useEffect(() => {
   
    if(!isLoading){
      // 프렌즈 컬렉션 : 내 id => id 배열 값 가져오기 
      firestore.collection('friends').get().then(function (querySnapshot){
      querySnapshot.forEach(function (doc) {
          if (doc.id == user.id){
              //console.log(doc.id, '=>', doc.data().id); 
              setFriendArray(doc.data().id);
          }       
      });
    });
  }  

  const userData = async() => {
     friendArray.forEach( async (id) => {
      firestore().collection('user').doc(id).get()
      .then((snapshot) => {
        data.push(snapshot.data())
        //setIddoc(data)
        if(data.length === friendArray.length){
          setIddoc(data)
          setIsLoading(true); 
        }        
      });
    })
  }
  
  if (friendArray !== []) {
    (async () => {
      await userData();
      setIsLoading(true);
    })();
  }
}, [user, friendArray, setIsLoading, setIddoc]);



  const inviteUsersToTeam = async () => {
    if (usersToInvite.length > 0) {
      const batch = firestore.batch();
      const teamRef = firestore().collection('Teams').doc(teamId);
      const invitedUsersRef = teamRef.collection("invitedUsers");
  
      usersToInvite.forEach((user) => {
        const newUserRef = invitedUsersRef.doc(user.id);
        batch.set(newUserRef, user);
      });
  
      await batch.commit();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.item}
        onPress={() =>
          navigation.navigate("UserProfile", {
            userInfo: item,
          })
        }
      >
        <Avatar
          style={styles.PhotoImage}
          source={item.photoURL && { uri: item.photoURL }}
        />
        <Text style={styles.title}>{item.displayName}</Text>
        <View style={styles.container}>
          <BouncyCheckbox
            style={{ marginTop: 10 }}
            justifyContent="flex-end"
            isChecked={usersToInvite.some((user) => user.id === item.id)}
            size={25}
            fillColor="#2E9AFE"
            onPress={() => {
              if (!usersToInvite.some((user) => user.id === item.id)) {
                setUsersToInvite([...usersToInvite, item]);
              } else {
                setUsersToInvite(
                  usersToInvite.filter((user) => user.id !== item.id)
                );
              }
            }}
          />
        </View>
      </Pressable>
    );
  };

  if (!isLoading) {
    return (
      <ActivityIndicator />
    )}
  else {
    return (
      <View>
        <Text style={styles.displayName}>친구</Text>
        <FlatList data={idDoc} renderItem={renderItem} keyExtractor={(item) => item.id} />
          <RNBounceable
            style={{
              marginTop: 16,
              height: 50,
              width: "100%",
              backgroundColor: "#2E9AFE",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              inviteUsersToTeam();
            }}
          >
          <Text style={{ color: "#fff" }}>채팅 초대</Text>
        </RNBounceable>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  block: { flex: 1 },
  separator: {
    backgroundColor: "#e0e0e0",
    height: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  PhotoImage: {
    marginRight: 10,
  },
  displayName: {
    padding: 10,
    lineHeight: 16,
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
  },
});


export default InviteFriends;