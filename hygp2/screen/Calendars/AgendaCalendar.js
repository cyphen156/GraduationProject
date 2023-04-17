import { format } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';

const firestore = firebase.firestore();
const auth = firebase.auth();

function AgendaCalendar({ navigation  }) {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const teamsRef = firestore.collection('teams');
    const unsubscribe = teamsRef.doc(teamId).onSnapshot((doc) => {
      navigation.setOptions({ 
        title: doc.data().name,
      });
    });
    fetchTodos();
    return () => {
      unsubscribe();
    };
  }, [teamId, navigation]);

  const fetchTodos = async () => {
    const uid = auth.currentUser.uid;
    const todosRef = firestore.collection(`teams`).doc(teamId).collection(`todos.${uid}`);

    const querySnapshot = await todosRef.get();

    const fetchedTodos = [];
    querySnapshot.forEach((doc) => {
      fetchedTodos.push(doc.data());
    });

    setTodos(fetchedTodos);
  };

  const markedDates = useMemo(
    () =>
      todos.reduce((acc, current) => {
        const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
        acc[formattedDate] = { marked: true };
        return acc;
      }, {}),
    [todos],
  );

  const filteredTodos = todos.filter((todo) => format(new Date(todo.date), 'yyyy-MM-dd') === selectedDate);

  return (
    <View style={styles.container}>
      <CalendarView markedDates={markedDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <ScrollView>
        {filteredTodos.map((todo, index) => (
          <View key={index} style={styles.todoItem}>
            <Text style={styles.todoText}>{todo.task}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AgendaCalendar;
