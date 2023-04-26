import { eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';

const firestore = firebase.firestore();

function TeamCalendar({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const colors = ["#00adf5", "#f0e68c", "#5f9ea0", "#ffa500"]; // 다양한 색상 배열 추가

  useEffect(() => {
    const teamsRef = firestore.collection('teams');
    const unsubscribe = teamsRef.doc(teamId).onSnapshot((doc) => {
      navigation.setOptions({
        title: doc.data().name,
      });
    });
  
    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
    const unsubscribeTodos = todosRef.onSnapshot((querySnapshot) => {
      const fetchedTodos = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTodos.push({
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
        });
      });
  
      setTodos(fetchedTodos);
    });
  
    return () => {
      unsubscribe();
      unsubscribeTodos();
    };
  }, [teamId, navigation]);

  // const fetchTodos = async () => {
  //   // 모든 팀원의 Todos 가져오기
  //   const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
  
  //   const querySnapshot = await todosRef.get();
  
  //   const fetchedTodos = [];
  //   querySnapshot.forEach((doc) => {
  //     const data = doc.data();
  //     fetchedTodos.push({
  //       ...data,
  //       startDate: data.startDate.toDate(),
  //       endDate: data.endDate.toDate(),
  //     });
  //   });
  
  //   setTodos(fetchedTodos);
  // };
  // 하루만 쓸때 사용하던 캘린더 마킹
  // const markedDates = useMemo(
  //   () =>
  //     todos.reduce((acc, current) => {
  //       const formattedDate = format(new Date(current.startDate), 'yyyy-MM-dd');
  //       acc[formattedDate] = { marked: true };
  //       return acc;
  //     }, {}),
  //   [todos],
  // );

  // 시작일과 종료일사이 interver 마킹 
  const markedDates = useMemo(() => {
    return todos.reduce((acc, current, index) => {
      const interval = eachDayOfInterval({
        start: current.startDate,
        end: current.endDate,
      });
  
      const color = colors[index % colors.length]; // 각 할 일에 대해 다른 색상 할당
  
      interval.forEach((date, i) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        if (!acc[formattedDate]) {
          acc[formattedDate] = { periods: [], marked: false };
        }
  
        if (acc[formattedDate].periods.length < 2) {
          if (i === 0 && i === interval.length - 1) {
            acc[formattedDate].marked = true;
          } else if (i === 0) {
            acc[formattedDate].periods.push({
              startingDay: true,
              endingDay: false,
              color: color,
              textColor: "#ffffff",
            });
          } else if (i === interval.length - 1) {
            acc[formattedDate].periods.push({
              startingDay: false,
              endingDay: true,
              color: color,
              textColor: "#ffffff",
            });
          } else {
            acc[formattedDate].periods.push({
              color: color,
              textColor: "#ffffff",
            });
          }
        }
      });
  
      return acc;
    }, {});
  }, [todos]);
  
  const filteredTodos = todos.filter((todo) => {
    const currentDate = startOfDay(new Date(selectedDate));
    const startDate = startOfDay(todo.startDate);
    const endDate = startOfDay(todo.endDate);
  
    return currentDate >= startDate && currentDate <= endDate;
  });

  // const onDateSelect = (date) => {
  //   setSelectedDate(date.dateString);
  // };

  return (
    <View style={styles.container}>
      {/* <View style={styles.calendarContainer}> */}
        <CalendarView
          markedDates={markedDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      {/* </View> */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredTodos.map((todo, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("TodoDetail", { todo })}
          >
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
  calendarContainer: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
