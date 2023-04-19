import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Button, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { friendIdSearch, removeFriend } from '../lib/friends';
import { useUserContext } from '../context/UserContext';
import Avatar from '../components/Avatar';
import {useNavigation, useNavigationState} from '@react-navigation/native'
import usePosts from '../hooks/usePosts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmptyFriend from '../components/EmptyFriend';

const FriendsList = () => {
  const {user, setUser} = useUserContext();
  const [friendArray, setFriendArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [idDoc, setIdDoc] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    firestore().collection('friends').get().then(function (querySnapshot){
      querySnapshot.forEach(function (doc) {
        if (doc.id == user.id){
          setFriendArray(doc.data().id);
        }       
      });
    });
  }, [user]);

  useEffect(() => {
    if (friendArray.length > 0 && !isLoading) {
      setIsLoading(true);
      Promise.all(
        friendArray.map(async (id) => {
          const snapshot = await firestore().collection('user').doc(id).get();
          return snapshot.data();
        })
      ).then((data) => {
        setIdDoc(data);
        setIsLoading(false); 
      });
    }
  }, [friendArray]);

  const renderItem = ({item}) => {
    const friendId = item.id;
    return (
      <Pressable style={styles.item} onPress={() => navigation.navigate('UserProfile', {userInfo: item})}>
        <Avatar style={styles.PhotoImage} source={item.photoURL && {uri: item.photoURL}} />
        <Text style={styles.title}>{item.displayName}</Text>
        <View style={{flexDirection: 'row-reverse', marginLeft: 'auto'}}>
          <Icon
            color="#9e9e9e" 
            name="cancel"
            size={20}
            onPress={() => {
              removeFriend(user.id, friendId);
              setIsLoading(true);
              navigation.goBack();
            }}
          />
        </View>
      </Pressable>
    );
  };

  if(friendArray.length === 0){
    return(
    <EmptyFriend />
    )
  }else{
    return (
        <View>
          <Text style={styles.displayName}>친구</Text>
          <FlatList
            data={idDoc}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      );
    };
}
const styles = StyleSheet.create({
  block: {flex: 1},
  separator: {
      backgroundColor: "#e0e0e0",
      height: 1,
      width: "100%",
  },
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  PhotoImage: {
    marginRight: 10,
  },
  displayName: {
    padding: 10,
    lineHeight: 16,
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
export default FriendsList;