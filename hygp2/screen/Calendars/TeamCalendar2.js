import { parseISO, eachDayOfInterval, format, isValid, isBefore } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';

const firestore = firebase.firestore();

const generateMarkedDates = (todos) => {
    const filteredTodos = {};
  
    todos.forEach((todo) => {
      const startDate = parseISO(todo.startDate);
      const endDate = parseISO(todo.endDate);
  
      if (isValid(startDate) && isValid(endDate) && isBefore(startDate, endDate)) {
        eachDayOfInterval({ start: startDate, end: endDate }).forEach((date) => {
          const formattedDate = format(date, 'yyyy-MM-dd');
  
          if (!filteredTodos[formattedDate]) {
            filteredTodos[formattedDate] = { todos: [] };
          }
  
          filteredTodos[formattedDate].todos.push(todo);
        });
      }
    });
  
    return filteredTodos;
  };

  const fetchTodosForDateRange = async (teamId) => {
    const snapshot = await firestore
      .collection("teams")
      .doc(teamId)
      .collection("todos")
      .get();
  
    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    return todos;
  };

function TeamCalendar2({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const teamsRef = firestore.collection('teams');
    const unsubscribe = teamsRef.doc(teamId).onSnapshot((doc) => {
      navigation.setOptions({
        title: doc.data().name,
      });
    });
  
    const fetchData = async () => {
      await fetchTodos();
    };
  
    fetchData();
  
    return () => {
      unsubscribe();
    };
  }, [teamId, navigation]);

  const fetchTodos = async () => {
    const fetchedTodos = await fetchTodosForDateRange(teamId);
    setTodos(fetchedTodos);
  };
  

  const markedDates = useMemo(() => generateMarkedDates(todos), [todos]);

  const onDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const todosForSelectedDate = markedDates[selectedDate]?.todos || [];

  return (
    <View style={styles.container}>
      <CalendarView markedDates={markedDates} selectedDate={selectedDate} onSelectDate={onDateSelect} />
      <ScrollView>
        {todosForSelectedDate.map((todo, index) => (
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

export default TeamCalendar2;
