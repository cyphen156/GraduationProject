import { useContext, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SearchContext from '../context/SearchContext';
import JoiningGroup from '../components/JoiningGroups';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { useUserContext } from '../context/UserContext';

const firestore = firebase.firestore();

function SearchScreen() {
  const { teams, searchText, recommendedInterest } = useContext(SearchContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { user } = useUserContext();

  const handlePress = (team) => {
    setSelectedTeam(team);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    const invitedUsersRef = firestore.collection(`teams/${selectedTeam.id}/invitedUsers`);
    
    const doc = await invitedUsersRef.doc(user.id).get();
    if (doc.exists) {
        Alert.alert("이미 소속된 팀입니다.");
        return;
    } else {
      doc.add({
        userData: {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        isHost: false
      }).then(() => {
        console.log("팀 입장완료");
      }).catch((error) => {
        console.error("팀 입장 불가", error);
      });
    }
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {selectedTeam && (
        <JoiningGroup
          visible={modalVisible}
          onRequestClose={handleClose}
          onConfirm={handleConfirm}
          team={selectedTeam}
        />
      )}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {searchText === '' && (
          <Text style={styles.recommendationText}>
            당신에게 추천하는 팀: {recommendedInterest}
          </Text>
        )}
        {teams && teams.map((team) => (
          <TouchableOpacity key={team.id} onPress={() => handlePress(team)}>
            <View style={styles.teamItem}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamDescription}>{team.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  teamItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  teamDescription: {
    fontSize: 16,
    color: "#888",
  },recommendationText: {
    color: '#9e9e9e',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SearchScreen;
