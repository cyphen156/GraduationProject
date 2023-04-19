import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import IconRightButton from '../../components/IconRightButton';
import IconLeftButton from '../../components/IconLeftButton';
import { useEffect } from 'react';

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

  const [task, setTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const addTodo = async () => {
    const uid = auth.currentUser.uid;
    const teamId = "your_team_id"; // TODO: Replace with the actual teamId from context or navigation params

    await firestore.collection(`teams`).doc(teamId).collection("todos").add({
      task,
      uid,
      startDate,
      endDate,
    });

    // Reset fields and navigate back
    setTask('');
    setStartDate('');
    setEndDate('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Task</Text>
      <TextInput value={task} onChangeText={setTask} />
      <Text>Start Date</Text>
      <TextInput value={startDate} onChangeText={setStartDate} />

      <Text>End Date</Text>
      <TextInput value={endDate} onChangeText={setEndDate} />

      <Button title="Add Todo" onPress={addTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default CreateTodos;