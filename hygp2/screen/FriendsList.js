import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { friendIdSearch } from '../lib/friends';
import { fromIdtoUser, getUserId } from '../lib/user';
import { useUserContext } from '../context/UserContext';
import FriendsContext from '../context/FriendsContext';

const FriendsList = () => {
  const {user, setUser} = useUserContext();
  const [friendArray, setFriendArray] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [idDoc, setIddoc] = useState([]);
  let data = [];
  useEffect(() => {
   
    if(!isLoading){
     firestore().collection('friends').get().then(function (querySnapshot){
      querySnapshot.forEach(function (doc) {
          if (doc.id == user.id){
              console.log(doc.id, '=>', doc.data().id); 
              setFriendArray(doc.data().id);
          }       
      });
    });
  }
  if(friendArray !== [])
    userData();

  }, [user, friendArray,]);

  function userData(){
   
     friendArray.forEach( async (id) => {
      console.log('id', id);
  
      firestore().collection('user').doc(id).get()
      .then((snapshot) => {
        data.push(snapshot.data())
        setIddoc(data)
        
      });
    })
    setIsLoading(true); 
  }

  const renderItem = ({item}) =>{
    return (
      <View style ={styles.item}>
        <Text style = {styles.title}>{item.displayName}</Text>
      </View>
    )
  }

  if(isLoading){
    return (
      <View>
        <Text>친구 목록:</Text>
        {friendArray.map((friend) => (
          <Text key={friend}>{friend}</Text>
        ))}
        
        <Text>----------------------------------------</Text>
        {data.map((data) => (
          <Text key={data}>{data}</Text>
        ))}
        <FlatList
          data ={data}
          renderItem= {renderItem}
          keyExtractor ={(item) => item.id}
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
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 16,
  },
});
export default FriendsList;