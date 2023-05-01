import { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SearchContext from '../context/SearchContext';

function SearchScreen() {
  const { teams } = useContext(SearchContext);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {teams && teams.map((team) => (
          <TouchableOpacity key={team.id}>
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
  },
});

export default SearchScreen;
