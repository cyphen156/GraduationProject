import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Table, Row } from 'react-native-table-component';
import PercentageCircle from './PercentageCircle';
import { ScrollView } from 'react-native-gesture-handler';
import TeamContext from './TeamContext';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import GanttChart from 'react-native-gantt-chart';

const firestore = firebase.firestore();

function TeamDashboard() {
  const { teamId } = useContext(TeamContext);
  const [userNames, setUserNames] = useState([]);
  const [taskCount, setTaskCount] = useState(0); // 총 작업 수
  const [completeCount, setCompleteCount] = useState(0); // 완료한 작업 수

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
  const tableHead = ['Name', 'Age', 'Gender'];

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
        querySnapshot.docs.forEach((doc) => {
          if(doc.data().complete){
            complete = complete + 1;
            //console.log("complete")
          }
          task = task + 1;
         // console.log("task")
        });
        setTaskCount(task);
        setCompleteCount(complete);
      });
  },[taskCount, completeCount]);
  
  const ganttData = [
    {title: 'task1', date: {start: new Date(2023, 5, 1), end: new Date(2023, 5, 5)}},
    {title: 'task2', date: {start: new Date(2023, 5, 6), end: new Date(2023, 5, 10)}},
    {title: 'task3', date: {start: new Date(2023, 5, 11), end: new Date(2023, 5, 15)}},
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        {/* <Text style={styles.chartTitle}>Sales Data</Text>
        <LineChart
          data={data}
          width={300}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        /> */}
        <Text style={styles.chartTitle}>Project Schedule</Text>
        <GanttChart
          data={ganttData}
          numberOfTicks={5}
          onPressTask={(task) => console.log(task)}
          gridMin={new Date(2023, 4, 1).getTime()}
          gridMax={new Date(2023, 6, 1).getTime()}
          colors={{
            barColorPrimary: '#0c2461',
            barColorSecondary: '#4a69bd',
            textColor: '#fff',
          }}
        />
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>유저</Text>
        <Table borderStyle={styles.table}>
          <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeaderText} />
            {userNames.map((username, i) => (
            <Row key={i} data={username} style={styles.tableRow} />
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

});

export default TeamDashboard;

