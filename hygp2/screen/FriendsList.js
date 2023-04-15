import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // 현재 로그인한 사용자의 UserID 가져오기
    const currentUserId = firebase.auth().currentUser.uid;

    /** 
    // Firebase Realtime Database에서 친구 목록 가져오기
    firebase.database().ref(`friends/${currentUserId}`).on('value', (snapshot) => {
      const friendsData = snapshot.val();
      if (friendsData) {
        // 친구 목록을 배열로 변환
        const friendsArray = Object.keys(friendsData);
        setFriends(friendsArray);
      }
    });
    */
   
  }, []);

  return (
    <View>
      <Text>친구 목록:</Text>
      {friends.map((friend) => (
        <Text key={friend}>{friend}</Text>
      ))}
    </View>
  );
};

export default FriendsList;