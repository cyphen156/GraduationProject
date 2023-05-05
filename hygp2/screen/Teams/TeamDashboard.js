import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CalendarHeatmap from 'react-native-calendar-heatmap';
import { Table, Row, Rows } from 'react-native-table-component';
import PercentageCircle from './PercentageCircle';
import { ScrollView } from 'react-native-gesture-handler';
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
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const values = [
    { date: '2023-01-01', count: 1 },
    { date: '2023-01-02', count: 2 },
    { date: '2023-01-03', count: 4 },
  ];

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>작업 목록</Text>
        <ScrollView horizontal>
          <View style={styles.todosListContainer}>
          {Object.keys(teamTodos).map((worker, index) => (
            <View key={index} style={styles.workerTodosContainer}>
              <Text style={styles.workerName}>{worker}</Text>
              {teamTodos[worker].todos.map((todo, i) => (
                <Text key={i} style={styles.todoItem}>
                  {todo.title}
                </Text>
              ))}
            </View>
          ))}
          </View>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            showOutOfRangeDays
            gutterSize={2}
            horizontal={true}
            showMonthLabels={true}
            onPress={(value) => console.log(value)}
            titleForValue={(value) => {
              if (!value) {
                return null;
              }
              return `${value.date}에 ${value.count}개의 작업이 있습니다.`;
            }}
            colorArray={[
              '#ebedf0',
              '#c6e48b',
              '#7bc96f',
              '#239a3b',
              '#196127',
            ]}
          />
        </ScrollView>
      </View>
      <View style={styles.tableContainer}>
        <Table borderStyle={styles.table}>
          <Row data={tableHead} style={styles.tableHead} />
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
      marginBottom: 16,
    },
    workerName: {
      fontSize: 16,
      marginRight: 16,
    },
});

export default TeamDashboard;

