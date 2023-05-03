import { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, useWindowDimensions, Pressable, Text } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/functions';
import SearchContext from '../context/SearchContext';

const firestore = firebase.firestore();

function SearchHeader() {
  const {width} = useWindowDimensions();
  const { searchText, setSearchText, setTeams, recommendedInterest, setRecommendedInterest } = useContext(SearchContext);

  const searchTeamsByHashtagOrName = async () => {
    if (searchText === '') return; // 검색어가 없는 경우 검색을 수행하지 않음

    const teamsRef = firestore.collection('teams');
    const snapshot = await teamsRef
      .where('hashtags', 'array-contains', searchText)
      .get();
    const nameSnapshot = await teamsRef
      .where('name', '==', searchText)
      .get();

    const searchedTeams = [
      ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...nameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ];

    setTeams(searchedTeams);
  };

  useEffect(() => {
    if (searchText === '') {
      fetchRecommendedTeams();
    } else {
      setTeams([]);  // 추천 그룹을 화면에서 제거
      setRecommendedInterest(''); // 추천 관심사를 제거
    }
  }, [searchText]);
  
  const fetchRecommendedTeams = async () => {
    try {
      const user = firebase.auth().currentUser;
  
      if (!user) {
        throw new Error('User not logged in!');
      }
      
      const getRecommendedTeams = firebase.functions().httpsCallable('getRecommendedTeams');
      const result = await getRecommendedTeams({ uid: user.uid });
      setTeams(result.data);

      // 추천 관심사 설정
      const userRef = firestore.collection('user').doc(user.uid);
      const userDoc = await userRef.get();
      const interests = userDoc.data().interests;
      console.log('11');
      console.log(interests);
      setRecommendedInterest(interests.join(', '));
      
    } catch (error) {
      console.error('Failed to fetch recommended teams:', error);
    }
  };

  return (
    <View style={[styles.block, {width: width - 32}]}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="팀 이름이나 해시태그를 입력하세요"
        autoFocus 
      />
      <Pressable
        style={({pressed}) => [
          styles.button, 
          pressed && {opacity: 0.5},
          { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' } // 추가
        ]}
        onPress={async () => {
          await searchTeamsByHashtagOrName();
        }}
      >
        <Icon name="search" size={20} color="#9e9e9e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
      flexDirection: "row",
      alignSelf: "center",
  },
  input: {
      flex: 0.85,
  },
  button: {
      marginLeft: 8,
  },
  // recommendation: {
  //     marginTop: 8,
  // },
  // recommendationText: {
  //     color: '#9e9e9e',
  //     fontSize: 16,
  // },
});

export default SearchHeader;

