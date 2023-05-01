import { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, Button, useWindowDimensions } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import SearchContext from '../context/SearchContext';

const firestore = firebase.firestore();

function SearchHeader() {
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
    <View style={[styles.block, {width: useWindowDimensions().width - 32}]}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by hashtag or team name..."
      />
      <Button title="Search" onPress={searchTeamsByHashtagOrName} />
    </View>
  );
}

const styles = StyleSheet.create({
    block: {
        flexDirection: "row",
        alignSelf: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    input: {
        flex: 1,
    },
    button: {
        marginLeft: 8,
    },
});

export default SearchHeader;

