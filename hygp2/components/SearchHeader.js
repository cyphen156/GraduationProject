import { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Button, useWindowDimensions, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import SearchContext from '../context/SearchContext';

const firestore = firebase.firestore();

function SearchHeader() {
  const {width} = useWindowDimensions();
  const { searchText, setSearchText, setTeams } = useContext(SearchContext);

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
          setSearchText('');
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
});

export default SearchHeader;

