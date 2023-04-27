import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';
import { useEffect } from 'react';
import WriteTeamTodos from '../../components/WriteTeamTodos';
import TeamContext from './TeamContext';
import { useUserContext } from '../../context/UserContext';

const firestore = firebase.firestore();
const auth = firebase.auth();

function CreateTodos({ navigation }) {

  const {user}= useUserContext();
  const { teamId } = useContext(TeamContext);
  const [task, setTask] = useState();
  const [discription, setDiscription] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  
  useEffect(() => {
    navigation.setOptions({
        title: 'CreateTodos', headerTitleAlign: 'center',
        headerLeft: () => (
          <>
            <IconLeftButton
                name="Profile"
                onPress={() => navigation.navigate('Profile')
              }
            />
          </>),
        headerRight: () => (
          <View style={{flexDirection: 'row'}}>
            <IconRightButton
              name="search"
              onPress={() => navigation.navigate('FriendsList')}
              />
            <IconRightButton
              name="person-add"
              onPress={() => navigation.navigate('FriendsAdd')}
            />
            <IconRightButton
              name="settings"
              onPress={() => navigation.navigate('Setting')}
            />      
          </View>   
        ),
    });

  }, [teamId, navigation]);
  
  const saveTodo = async () => {
    const startDateTimestamp = firebase.firestore.Timestamp.fromDate(startDate);
    const endDateTimestamp = firebase.firestore.Timestamp.fromDate(endDate);
    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");

      // todoId가 없다면, 새로운 할 일을 생성한다.
      const docRef = await todosRef.add({
        task,
        discription,
        worker: user.displayName,
        startDate: startDateTimestamp,
        endDate: endDateTimestamp,
      });

      // Set the new todoId
      setTodoId(docRef.id);
    
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
        <Button title="그룹 할 일 생성" onPress={saveTodo} />
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

export default CreateTodos;