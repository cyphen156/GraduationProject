import { eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Button, SwitchBase, Pressable } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import CalendarView from '../../components/CalendarView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from '../../components/TransparentCircleButton';
import { Switch } from 'react-native-switch';
import { Dimensions } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import Avatar from "../../components/Avatar";

const firestore = firebase.firestore();
const auth = firebase.auth();

function MyCalendar() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const colors = ["#00adf5", "#f0e68c", "#5f9ea0", "#ffa500"]; // 다양한 색상 배열 추가
  const { width, height } = Dimensions.get('window');
  const userId = auth.currentUser.uid;  // 현재 사용자의 ID를 가져옵니다.
  const navigation = useNavigation();
  const {user}= useUserContext();

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: '내 일정',
      headerLeft: () => (
        <>
          <Pressable style={styles.profile}  onPress={() => navigation.navigate('Profile')}>
            <Avatar source={user.photoURL && {uri: user.photoURL}} size={38} />
          </Pressable>
        </>
      ),
    });
  }, [navigation]);

  const fetchAllTeams = async () => {
    const uid = auth.currentUser.uid;
    const teamsRef = firestore.collection('teams');
    const teamIds = [];
  
    //invitedUsers를 조회해서 내가 소속된 팀 정보 모두 불러오기
    const snapshot = await teamsRef.get();
    await Promise.all(snapshot.docs.map(async (doc) => {
      const invitedUsersRef = teamsRef.doc(doc.id).collection('invitedUsers');
      const userSnapshot = await invitedUsersRef.doc(uid).get();
      if(userSnapshot.exists) {
        teamIds.push(doc.id);
      }
    }));
    return teamIds;
  };
  
  const fetchTodos = async () => {
    const teamIds = await fetchAllTeams();
    const fetchedTodos = [];

    const displayName = user.displayName;
    console.log(displayName);
    //팀 할 일 목록 가져오기
    for (let teamId of teamIds) {
      const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos").where("worker", "==", displayName);
      const snapshot = await todosRef.get();
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTodos.push({
          id: `${teamId}_${doc.id}`,
          ...data,
          startDate: data.startDate.toDate(),
          endDate: data.endDate.toDate(),
        });
      });
    }
  
    //내 할 일 목록 가져오기
    const userRef = firestore.collection('user').doc(userId);
    const myTodosRef = userRef.collection('myTodos');
    const myTodosSnapshot = await myTodosRef.get();
    myTodosSnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedTodos.push({
        id: `${userId}_${doc.id}`,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
      });
      console.log("fetchedTodos : "+JSON.stringify(fetchedTodos));
    });
    setTodos(fetchedTodos);
  };
  

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
      <View style={{flexDirection: 'row', marginRight: 16}}>
          <TransparentCircleButton
            name="add"
            color="#4096ee"
            onPress={() => {
                navigation.navigate("CreateMyTodos", {selectedDate});
              }}
            />
      </View>   
      ),
  });
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTodos();
    });

    return unsubscribe;
  }, [navigation]);
  
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
      <CalendarView
        markedDates={markedDates}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredTodos.map((todo) => {
          const { id } = todo;
          console.log("ID"+id);

          // 토글 버튼
          const handleToggle = async ({ complete, id }) => {
            let tasking = !complete;
            // 팀 아이디가 id 문자열에 포함되어 있으면 팀의 할 일로 간주
            if (id.includes("_")) {
              const teamId = id.split("_")[0];
              const todoId = id.split("_")[1];
              const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
              await todosRef.doc(todoId).update({
                complete: tasking
              });
            } else {
              // 팀 아이디가 없으면 개인의 할 일로 간주
              const todosRef = firestore.collection(`user`).doc(userId).collection("myTodos");
              await todosRef.doc(id).update({
                complete: tasking
              });
            }
            setTodos(todos.map((t) => t.id === id ? {...t, complete: tasking} : t));
          };
            
          return(
            <TouchableOpacity key={id}>
              <View style={styles.todoItem}> 
                <View style={styles.todoMeta}>
                  <Text style={styles.todoTitle}>{todo.task}</Text>
                    <Icon name="edit" size={25} onPress={() => {
                      console.log(JSON.stringify(todo));
                      navigation.navigate("UpdateMyTodos", { todoId: id})} }
                      style={{marginLeft: 10, marginRight: 10}}/>
                </View>
                <View style={styles.todoMeta}>
                  <Text style={styles.todoText}>작업자: {todo.worker}</Text>
                  <View style={styles.icons}>
                    {/* <Text>작업 상태</Text>
                    <Switch
                      value={todo.complete}
                      onValueChange={() => handleToggle({complete: todo.complete, id})}
                      activeText={'완료'}
                      inActiveText={'미완료'}
                      barHeight={20}
                      circleSize={25}
                      switchWidthMultiplier={3}
                    /> */}
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
  profile: {
    marginLeft: 16,
  },
});


export default MyCalendar;
