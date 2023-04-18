import { format } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';
import { Calendar } from 'react-native-calendars';

const firestore = firebase.firestore();
const auth = firebase.auth();

function TeamCalendar({ navigation }) {
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
    // 모든 팀원의 Todos 가져오기
    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");

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

export default TeamCalendar;
