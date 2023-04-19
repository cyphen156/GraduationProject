import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { friendIdSearch, removeFriend } from '../lib/friends';
import { fromIdtoUser, getUserId } from '../lib/user';
import { useUserContext } from '../context/UserContext';
import Avatar from '../components/Avatar';
import {useNavigation, useNavigationState} from '@react-navigation/native'
import usePosts from '../hooks/usePosts';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FriendsList = () => {
  const {user, setUser} = useUserContext();
  const [friendArray, setFriendArray] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [idDoc, setIddoc] = useState([]);
  let data = [];
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const { onRefreshWithFriends } = usePosts();

  useEffect(() => {
    if (!isLoading) {
      firestore().collection('friends').get().then(function (querySnapshot){
        querySnapshot.forEach(function (doc) {
          if (doc.id == user.id){
            setFriendArray(doc.data().id);
            console.log("friendArray :" ,friendArray)
          }       
        });
      });
    }
  }, [user, isLoading]);
  
  useEffect(() => {
    if (friendArray.length > 0) {
      userData().then(() => {});
    }
  }, [friendArray]);
  
  const userData = async() => {
    friendArray.forEach( async (id) => {
      firestore().collection('user').doc(id).get()
      .then((snapshot) => {
        data.push(snapshot.data())
        if(data.length === friendArray.length){
          setIddoc(data)
          setIsLoading(true); 
        }        
      });
    })
  }

  const renderItem = ({item}) =>{
    const friendId = item.id;
    return (
      <>
        <Pressable style ={styles.item} 
        onPress={()=>  navigation.navigate('UserProfile', {
          userInfo: item,
        })}>
          <Avatar style={styles.PhotoImage} source={item.photoURL && {uri: item.photoURL}} />
          <Text style = {styles.title}>{item.displayName}</Text>
          <View style={{flexDirection: 'row-reverse', marginLeft: 'auto'}}>
          <Icon
              color="#9e9e9e" 
              name="cancel"
              size={20}
              onPress={() => {
                removeFriend(user.id, friendId)
                setIsLoading(true); // 버튼 클릭 시 isLoading 상태를 갱신함으로써 화면을 새로고침합니다.
                navigation.goBack();
                
              }}
            />
          </View>
        </Pressable>
      </>
    )
  }

  if(isLoading){
    return (
      <View>
        <Text style={styles.displayName}>친구</Text>

        <FlatList
          data ={idDoc}
          renderItem= {renderItem}
          keyExtractor ={(item) => item.id}
          extraData={refresh}
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