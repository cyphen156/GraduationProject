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

const firestore = firebase.firestore();
const auth = firebase.auth();

function CreateTodos({ navigation }) {

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
    },[navigation])

  const { teamId } = useContext(TeamContext);
  const [task, setTask] = useState('');

  const [endDate, setEndDate] =useState(log ? new Date(log.date) : new Date());
  const [startDate, setStartDate] = useState(log ? new Date(log.date) : new Date());
  const log = new Date();
  console.log("startDate", startDate)
  const addTodo = async () => {
    const uid = auth.currentUser.uid;
    await firestore.collection(`teams`).doc(teamId).collection("todos").add({
      task,
      uid,
      startDate,
      endDate,
    });

    // Reset fields and navigate back
    setTask('');
    setStartDate(log);
    setEndDate(log);
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

      <Text style={styles.boldText}>시작</Text>
      <WriteTeamTodos 
                    date={startDate}
                    onChangeDate={setStartDate} />
      <Text style={styles.boldText}>끝</Text>
      <WriteTeamTodos 
                    date={endDate}
                    onChangeDate={setEndDate} />

      <View style={styles.buttonContainer}>
        <Button title="그룹 할 일 생성" onPress={addTodo} />
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