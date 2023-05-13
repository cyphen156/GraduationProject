import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';
import { useEffect } from 'react';
import WriteTeamTodos from '../../components/WriteTeamTodos';
import { useUserContext } from '../../context/UserContext';
import TransparentCircleButton from '../../components/TransparentCircleButton';

const firestore = firebase.firestore();
const auth = firebase.auth();

function UpdateMyTodos({ navigation, route }) {

  const {user}= useUserContext();
  const [teamId, setTeamId] = useState('');
  const [task, setTask] = useState('');
  const [discription, setDiscription] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [todoId, setTodoId] = useState(route.params?.todoId); // todoId 값을 받는다.
  const [taskId, setTaskId] = useState();
  useEffect(() => {
    if (todoId) {
      const parsedTeamId = todoId.split("_")[0];
      const parsedTodoId = todoId.split("_")[1];
      console.log(parsedTeamId);
      console.log(parsedTodoId);
      setTeamId(parsedTeamId);
      setTaskId(parsedTodoId);
    }
  }, [todoId]);
  
  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: () => (
      <View style={{flexDirection: 'row' ,}}>
        <TransparentCircleButton
          name="delete-forever"
          color="#ef5350"
          onPress={() => {
            let todosRef = ''
            if (teamId == user.id){
              todosRef = firestore.collection(`user`).doc(teamId).collection("myTodos");
              console.log('1\n\n' + teamId);
            }else{
              todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
              console.log('12\n\n' + teamId);
            }
            todosRef.doc(taskId).delete();
            navigation.pop();
          }}
        />
      </View>   
      ),
    });

    if (taskId) { // taskId가 있다면, 기존의 할 일을 불러온다.
      let todosRef = ''
      console.log('123123132\n\n' + teamId);
      console.log('333333333\n\n' + taskId);
      if (teamId == user.id){
        todosRef = firestore.collection(`user`).doc(teamId).collection("myTodos");
        console.log('1\n\n' + teamId);
      }else{
        todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
        console.log('12\n\n' + teamId);
      }
      todosRef.doc(taskId).get().then((doc) => {
        console.log('123\n\n' + teamId);
        const data = doc.data();
        console.log("Document data:", data);

        setTask(data.task);
        setDiscription(data.discription);
        setStartDate(data.startDate.toDate());
        setEndDate(data.endDate.toDate());
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }
  }, [taskId, teamId, navigation]);
  
  const saveTodo = async () => {
    console.log('k'+teamId);

    if(startDate > endDate){
      Alert.alert("잘못된 날짜 입니다.");
      return;
    }
    if(task === '' || discription === ''){
      Alert.alert("제목과 설명을 작성하세요.");
      return;
    }
    const startDateTimestamp = firebase.firestore.Timestamp.fromDate(startDate);
    const endDateTimestamp = firebase.firestore.Timestamp.fromDate(endDate);
    let todosRef = ''
    console.log('kk'+teamId);
    if (teamId == user.id){
      todosRef = firestore.collection(`user`).doc(teamId).collection("myTodos");
    }else{
      todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
    }
    await todosRef.doc(taskId).update({
      task,
      discription,
      worker: user.displayName,
      startDate: startDateTimestamp,
      endDate: endDateTimestamp,
      teamId: teamId,
    });

    // Reset fields and navigate back
    setTask('');
    setDiscription('');
    setStartDate(new Date());
    setEndDate(new Date());
    navigation.goBack();
    setTaskId(null);
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="제목" 
        placeholderTextColor="#BBBBBB" 
        value={task} 
        onChangeText={setTask} 
      />
      <TextInput 
        style={styles.input}
        placeholder="설명" 
        placeholderTextColor="#BBBBBB" 
        value={discription} 
        onChangeText={setDiscription} 
      />
      <Text style={styles.boldText}>시작</Text>
      <WriteTeamTodos 
        date={startDate}
        onChangeDate={setStartDate} />
      <Text style={styles.boldText}>끝</Text>
      <WriteTeamTodos 
        date={endDate}
        onChangeDate={setEndDate} />
      <View style={styles.buttonContainer}>
        <Button title="일정 변경" onPress={saveTodo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  boldText : {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 24,
    color: '#555555',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#BBBBBB',
    marginBottom: 32,
    paddingBottom: 8,
  },
  settings : {
    marginRight: 16,
    flexDirection: 'row',
  },
});

export default UpdateMyTodos;