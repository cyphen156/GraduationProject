import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import HeatMap from 'react-native-heatmap-chart';
import { Table, Row, Rows } from 'react-native-table-component';
import PercentageCircle from './PercentageCircle';
import { ScrollView } from 'react-native-gesture-handler';
import { format, eachDayOfInterval } from 'date-fns';
import TeamContext from './TeamContext';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const firestore = firebase.firestore();

function TeamDashboard() {
  const { teamId } = useContext(TeamContext);
  const [userNames, setUserNames] = useState([]);
  const [taskCount, setTaskCount] = useState(0); // 총 작업 수
  const [completeCount, setCompleteCount] = useState(0); // 완료한 작업 수
  const [todos, setTodos] = useState([]);
  const [tableHead] = useState(['작업자명', '작업', '완료']);
  const [teamTodos, setTeamTodos] = useState({});
  const [todosByDate, setTodosByDate] = useState({});
  const [userColors, setUserColors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const navigation = useNavigation();

  const colors = [
    "#FFA07A", "#7FFFD4", "#D2691E", "#DC143C",
    "#90EE90", "#FFD700", "#FF4500", "#2E8B57",
    "#ADFF2F", "#32CD32"
  ];

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      title: '대시보드',
    });
  }, [navigation]);

  useEffect(() => {
    const newUserColors = userNames.reduce((acc, name, index) => {
      acc[name] = colors[index % colors.length];
      return acc;
    }, {});
  
    setUserColors(newUserColors);
  }, [userNames]);
  
  useEffect(() => {
    setTodosByDate(getTodosByDate(todos));
  }, [todos]);

  // 채팅방 유저 가져오기
  useEffect(() => {
    const chatUsersRef = firestore.collection('teams').doc(teamId).collection('invitedUsers');
    const unsubscribe = chatUsersRef.onSnapshot((querySnapshot) => {
      const names = querySnapshot.docs.map((doc) => {
        const data = doc.data().userData;
        return [ data.displayName ];
      });
      setUserNames(names);
    });
    return () => {
      unsubscribe();
    }
  }, [teamId]);

  // 총 작업 수 , 완료한 작업 수
  useFocusEffect(
    React.useCallback(() => {
      let task = 0;
      let complete = 0;
      const chatUsersRef = firestore.collection('teams').doc(teamId).collection('todos');
      const unsubscribe = chatUsersRef.onSnapshot((querySnapshot) => {
        const todosData = [];
        querySnapshot.docs.forEach((doc) => {
          if (doc.data().complete) {
            complete = complete + 1;
          }
          task = task + 1;
          todosData.push({
            id: doc.id,
            data: doc.data()
          });
        });
        setTaskCount(task);
        setCompleteCount(complete);
        setTodos(todosData);
        setTeamTodos(workerList(todosData));
      });
      return () => {
        unsubscribe();
      }
    }, [teamId]),
  );

  //todos worker 별로 분류
  const workerList = (todos) => {
    const teamTodos = {};
  
    todos.forEach((todo) => {
      const worker = todo.data.worker;
      const complete = todo.data.complete;

      if (!teamTodos[worker]) {
        teamTodos[worker] = {
          completed: 0,
          total: 0,
          todos: [],
        };
      }
      if (complete) {
        teamTodos[worker].completed++;
      }
      teamTodos[worker].total++;
      teamTodos[worker].todos.push(todo);
    });
    return teamTodos;
  };

  const onClick = (date, workerTodos) => {
    setSelectedData({date, workerTodos});
    console.log(JSON.stringify(selectedData, null, 2));
    setModalVisible(true);
  };

  const getTodosByDate = (todos) => {
    const todosByDate = {};
  
    todos.sort((a, b) => a.data.startDate.toDate() - b.data.startDate.toDate());

    todos.forEach((todo) => {
      const startDate = format(todo.data.startDate.toDate(), 'yyyy-MM-dd');
      const endDate = format(todo.data.endDate.toDate(), 'yyyy-MM-dd');
  
      const dateRange = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      }).map((date) => format(date, 'yyyy-MM-dd'));
      dateRange.forEach((date) => {
        if (!todosByDate[date]) {
          todosByDate[date] = [];
        }
        todosByDate[date].push(todo);
      });
    });
    return todosByDate;
  };

  const renderHeatmap = () => {
    const rows = userNames.map((worker) => {
    const cells = Object.keys(todosByDate).map((date) => {
      const workerTodos = (todosByDate[date] || []).filter((todo) => todo.data.worker == worker)
      let color;
      if (workerTodos.length === 0) {
        color = "#FFFFFF";
      } else {
        const hasIncompleteTodo = workerTodos.some((todo) => !todo.data.complete);
        color = hasIncompleteTodo ? userColors[worker] || "#FFFFFF" : "#d0d0d0";
      }
    return (
      <TouchableOpacity
            key={`${worker}-${date}`}
            style={[
              styles.workerTodosHeatMapCell,
              { backgroundColor: color },
            ]}
            onPress={() => {
              onClick(date, workerTodos)
              // Add the code to display the todo summary in the modal
            }}
          />
        );
      });
      return (
        <View key={worker} style={styles.workerTodosContainer}>
          <Text style={styles.workerName}>{worker}</Text>
          <View style={styles.workerTodosHeatMap}>{cells}</View>
        </View>
      );
    });
    return <View style={styles.todosListContainer}>{rows}</View>;
  };
  return (
      <ScrollView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>작업 목록</Text>
          <ScrollView horizontal>{renderHeatmap()}</ScrollView>
        </View>
        <View style={styles.tableContainer}>
          <Table borderStyle={styles.table}>
            <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeaderText}/>
              {Object.keys(teamTodos).map((worker, index) => (
                <Rows
                  key={index}
                  data={[
                    [
                      worker,
                      teamTodos[worker].total,
                      teamTodos[worker].completed,
                    ],
                  ]}
                  style={styles.tableRow}
                  textStyle={styles.tableRowText}
                />
              ))}
          </Table> 
        </View>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>작업 진행량</Text>
          <Text>총 작업 수 : {taskCount}</Text>
          <Text>완료된 작업 수 : {completeCount}</Text>
          <PercentageCircle percentage={Math.floor((completeCount/taskCount)*100)}/>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {selectedData.date && (
                  <>
                    <Text style={styles.modalText}>{selectedData.date}</Text>
                    <Text>{selectedData.workerTodos[0].data.worker}의 할 일</Text>
                    {selectedData.workerTodos.map((todo) => (
                      <Text key={todo.id}> 
                        {todo.data.task} : {todo.data.complete ? '완료' : '미완료'}
                      </Text>
                    ))}                  
                  </>
                )}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text>뒤로 가기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5FCFF',
      zIndex: 1,
    },
    chartContainer: {
      alignItems: 'center',
      backgroundColor: '#81C784',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
    },
    chartTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#FFFFFF',
    },
    tableContainer: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
    },
    tableTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    tableHead: {
      backgroundColor: '#81C784',
      padding: 8,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    tableRow: {
      backgroundColor: '#FFFFFF',
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
    },
    tableHeaderText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    tableRowText: {
      fontSize: 14,
      color: '#333333',
    },
    todosListContainer: {
      flexDirection: 'column',
      marginBottom: 16,
    },
    todoItem: {
      fontSize: 16,
      marginBottom: 8,
    },
    workerTodosContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    workerName: {
      fontSize: 16,
      marginRight: 16,
      width: 75,
    },
    workerTodosHeatMap: {
      flexDirection: "row",
    },
    workerTodosHeatMapCell: {
      width: 20,
      height: 20,
      marginLeft: 2,
      marginRight: 2,
    },
    //modal
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      zIndex: 2,
    },
    modalView: {
      width: 250,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    buttonRow: {
      flexDirection: 'row',
    },
    Yes: {
      marginRight: 10,
    }
});

export default TeamDashboard;

