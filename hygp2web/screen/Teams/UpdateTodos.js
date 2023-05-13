import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';
import { useEffect } from 'react';
import WriteTeamTodos from '../../components/WriteTeamTodos';
import TeamContext from './TeamContext';
import { useUserContext } from '../../context/UserContext';
import TransparentCircleButton from '../../components/TransparentCircleButton';

const firestore = firebase.firestore();
const auth = firebase.auth();

function UpdateTodos({ navigation, route }) {

  const {user}= useUserContext();
  const { teamId } = useContext(TeamContext);
  const [task, setTask] = useState('');
  const [discription, setDiscription] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [todoId, setTodoId] = useState(route.params?.todoId); // todoId 값을 받는다.
  
  useEffect(() => {
    navigation.setOptions({
        headerTitleAlign: 'center',
        headerRight: () => (
        <View style={{flexDirection: 'row' ,}}>
            <TransparentCircleButton
              name="delete-forever"
              color="#ef5350"
              onPress={() => {
                const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos")
                todosRef.doc(todoId).delete();
                navigation.pop();
              }}
            />
        </View>   
        ),
    });
    if (todoId) { // todoId가 있다면, 기존의 할 일을 불러온다.
      const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");
      todosRef.doc(todoId).get().then((doc) => {
        const data = doc.data();
        setTask(data.task);
        setDiscription(data.discription);
        setStartDate(data.startDate.toDate());
        setEndDate(data.endDate.toDate());
      });
    }
  }, [todoId, teamId, navigation]);
  
  const saveTodo = async () => {
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
    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");

      await todosRef.doc(todoId).update({
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
    setTodoId(null);
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
}
});

export default UpdateTodos;