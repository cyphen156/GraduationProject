import { eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const firestore = firebase.firestore();

function TeamCalendar({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const colors = ["#00adf5", "#f0e68c", "#5f9ea0", "#ffa500"]; // 다양한 색상 배열 추가
  const [taskState, setTaskState] = useState(false); // 작업 진행, 완료 토글버튼

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
          id: doc.id, // Document ID를 추가합니다.
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

  // 작업 진행 버튼
  const toggleIsDone = () => {
    setTaskState((e) => !e); 
  }
  //삭제 버튼
  const onAskRemove = () => {
    Alert.alert(
      '삭제',
      '정말로 삭제하시겠어요?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          onPress: () => {
            onRemove(log?.id);
            navigation.pop();
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
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
        {filteredTodos.map((todo) => {
          const { id } = todo;
          return(
            <TouchableOpacity key={id}>
              <View style={styles.todoItem}>
                <Text style={styles.todoTitle}>{todo.task}</Text>
                <View style={styles.todoMeta}>
                  <Text style={styles.todoText}>작업자: {todo.worker}</Text>
                  <View style={styles.icons}>
                    <Button title={taskState ? '진행 중' : '완료'} onPress={toggleIsDone} />
                    <Icon name="edit" size={25} 
                      style={{ marginRight: 5 }} 
                      onPress={() => navigation.navigate("CreateTodos", { todoId: id })}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: 20,
  },
  todoItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  todoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  todoMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#888",
  },
  icons: {
    flexDirection: "row",
    alignItems: 'center',
  },
});

export default TeamCalendar;
