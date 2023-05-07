import { eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useState, useMemo, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Button, SwitchBase } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import TeamContext from '../Teams/TeamContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from '../../components/TransparentCircleButton';
import { Switch } from 'react-native-switch';
import { Dimensions } from 'react-native';


const firestore = firebase.firestore();

function TeamCalendar({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const colors = ["#00adf5", "#f0e68c", "#5f9ea0", "#ffa500"]; // 다양한 색상 배열 추가
  const { width, height } = Dimensions.get('window');
  useEffect(() => {

    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
      <View style={{flexDirection: 'row', marginRight: 16}}>
          <TransparentCircleButton
            name="add"
            color="#4096ee"
            onPress={() => {
                  navigation.navigate("CreateTodos", {selectedDate});
                }}
            />
      </View>   
      ),
  });
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
          acc[formattedDate] = {
            periods: [],
            marked: interval.length === 1 ? true : false,
          };
        }
  
        if (acc[formattedDate].periods.length < 2) {
          if (i === 0 && i === interval.length - 1) {
            acc[formattedDate].marked = true;
            acc[formattedDate].periods.push({
              startingDay: true,
              endingDay: true,
              color: color,
              textColor: "#ffffff",
            });
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

    // 토글 버튼
    const handleToggle = async ({todo, id}) => {
      const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
      let tasking = !(todo.complete);
      await todosRef.doc(id).update({
        complete: tasking
      });

    }

    return(
    <TouchableOpacity key={id}>
      <View style={styles.todoItem}> 
        <View style={styles.todoMeta}>
          <Text style={styles.todoTitle}>{todo.task}</Text>
            <Icon name="edit" size={25} onPress={() => 
              navigation.navigate("UpdateTodos", { todoId: id })} 
              style={{marginLeft: 10, marginRight: 10}}/>
        </View>
        <View style={styles.todoMeta}>
          <Text style={styles.todoText}>작업자: {todo.worker}</Text>
          <View style={styles.icons}>
            <Text>작업 상태</Text>
            <Switch
              value={todo.complete}
              onValueChange={() => handleToggle({todo, id})}
              activeText={'완료'}
              inActiveText={'미완료'}
              barHeight={20}
              circleSize={25}
              switchWidthMultiplier={3}
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
    padding: 20,  // 스크롤뷰 내부 간격 조정
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

  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#888",
  },
  icons: {
   
    alignItems: 'center',
  },
});

export default TeamCalendar;
