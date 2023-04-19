import { useState, useEffect, useContext, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';
import { Calendar } from 'react-native-calendars';

const firestore = firebase.firestore();
const auth = firebase.auth();

function MyCalendar() {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const unsubscribe = fetchTodos();
    return () => {
      unsubscribe();
    };
  }, [teamId]);

  const fetchTodos = () => {
    const uid = auth.currentUser.uid;
    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos").where("uid", "==", uid);

    const unsubscribe = todosRef.onSnapshot((querySnapshot) => {
      const fetchedTodos = [];
      querySnapshot.forEach((doc) => {
        fetchedTodos.push(doc.data());
      });
      setTodos(fetchedTodos);
    });

    return unsubscribe;
  };

  const markedDates = useMemo(
    () =>
      todos.reduce((acc, current) => {
        const formattedDate = format(new Date(current.startDate), 'yyyy-MM-dd');
        acc[formattedDate] = { marked: true };
        return acc;
      }, {}),
    [todos],
  );

  const filteredTodos = todos.filter(
    (todo) => format(new Date(todo.startDate), 'yyyy-MM-dd') === selectedDate,
  );

  const onDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };
  return (
    <View style={styles.container}>
      <CalendarView markedDates={markedDates} onDayPress={onDateSelect} />
      <ScrollView>
        {filteredTodos.map((todo, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('TodoDetail', { todo })}>
            <View style={styles.todoItem}>
              <Text style={styles.todoTitle}>{todo.task}</Text>
              <Text style={styles.todoText}>작업자: {todo.worker}</Text>
            </View>
          </TouchableOpacity>
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
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyCalendar;
