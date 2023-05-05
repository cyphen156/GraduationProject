import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import HeatMap from 'react-native-heatmap-chart';
import { Table, Row, Rows } from 'react-native-table-component';
import PercentageCircle from './PercentageCircle';
import { ScrollView } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import TeamContext from './TeamContext';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firestore = firebase.firestore();

function TeamDashboard() {
  const { teamId } = useContext(TeamContext);
  const [userNames, setUserNames] = useState([]);
  const [taskCount, setTaskCount] = useState(0); // 총 작업 수
  const [completeCount, setCompleteCount] = useState(0); // 완료한 작업 수
  const [todos, setTodos] = useState([]);
  const [tableHead] = useState(['작업자명', '할 일', '완료']);
  const [teamTodos, setTeamTodos] = useState({});
  const [todosByDate, setTodosByDate] = useState({});

  const colors = [
    "#FFA07A", "#7FFFD4", "#D2691E", "#DC143C",
    "#90EE90", "#FFD700", "#FF4500", "#2E8B57",
    "#ADFF2F", "#32CD32"
  ];

  const userColors = userNames.reduce((acc, name, index) => {
    acc[name] = colors[index % colors.length];
    return acc;
  }, {});
  
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
  }, [teamId]);

  // 총 작업 수 , 완료한 작업 수
  useEffect(() => {
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
        todosData.push(doc.data());
      });
      setTaskCount(task);
      setCompleteCount(complete);
      setTodos(todosData);
      setTeamTodos(workerList(todosData));
    }, [taskCount, completeCount, teamId]);
  }, []);

  //todos worker 별로 분류
  const workerList = (todos) => {
    const teamTodos = {};
  
    todos.forEach((todo) => {
      if (!teamTodos[todo.worker]) {
        teamTodos[todo.worker] = {
          completed: 0,
          total: 0,
          todos: [],
        };
      }
      if (todo.complete) {
        teamTodos[todo.worker].completed++;
      }
      teamTodos[todo.worker].total++;
      teamTodos[todo.worker].todos.push(todo);
    });
    return teamTodos;
  };

  const getTodosByDate = (todos) => {
    const todosByDate = {};
  
    todos.forEach((todo) => {
      const startDate = format(todo.startDate.toDate(), 'yyyy-MM-dd');
      const endDate = format(todo.endDate.toDate(), 'yyyy-MM-dd');
  
      if (!todosByDate[startDate]) {
        todosByDate[startDate] = [];
      }
      if (!todosByDate[endDate]) {
        todosByDate[endDate] = [];
      }
  
      todosByDate[startDate].push(todo);
      todosByDate[endDate].push(todo);
    });
  
    return todosByDate;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>작업 목록</Text>
        <ScrollView horizontal>
          <View style={styles.todosListContainer}>
            <Table borderStyle={styles.table}>
            {Object.keys(teamTodos).map((worker, index) => (
              <View key={index} style={styles.workerTodosContainer}>
                <Text style={styles.workerName}>{worker}</Text>
                <View style={styles.workerTodosHeatMap}>
                  {Object.keys(todosByDate).map((date, i) => {
                    const workerTodos = todosByDate[date].filter(
                      (todo) => todo.worker === worker
                    );
                    const color =
                      workerTodos.length > 0
                        ? userColors[workerTodos[0].worker] || "#FFFFFF"
                        : "#FFFFFF";
                    return (
                      <View
                        key={`${worker}-${i}`}
                        style={[
                          styles.workerTodosHeatMapCell,
                          { backgroundColor: color },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
            </Table>
          </View>
        </ScrollView>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5FCFF',
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
});

export default TeamDashboard;

