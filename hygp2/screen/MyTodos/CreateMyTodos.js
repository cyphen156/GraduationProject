import { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { useEffect } from 'react';
import WriteTeamTodos from '../../components/WriteTeamTodos';
import { useUserContext } from '../../context/UserContext';

const firestore = firebase.firestore();

function CreateMyTodos({ navigation, route }) {

  const {user}= useUserContext();
  const [task, setTask] = useState('');
  const [discription, setDiscription] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate); // 지정된 날짜 값을 받는다.

  useEffect(() => {
    //console.log("selectedDate", selectedDate);
    navigation.setOptions({
      headerTitleAlign: 'center',
    });

  }, [navigation]);
  
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
    const todosRef = firestore.collection(`user`).doc(user.id).collection("myTodos");

      // todoId가 없다면, 새로운 할 일을 생성한다.
      let name = user.displayName;
      const docRef = await todosRef.add({
        task,
        discription,
        worker: name,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
        complete : false,
        teamId: user.id,
      });
    
    // Reset fields and navigate back
    setTask('');
    setDiscription('');
    setStartDate(new Date());
    setEndDate(new Date());
    navigation.goBack();
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
        <Button title="나의 할 일 생성" onPress={saveTodo} />
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
});

export default CreateMyTodos;