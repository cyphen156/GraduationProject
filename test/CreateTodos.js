import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import TeamContext from './TeamContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const firestore = firebase.firestore();
const auth = firebase.auth();
const [showStartDatePicker, setShowStartDatePicker] = useState(false);
const [showEndDatePicker, setShowEndDatePicker] = useState(false);

function CreateTodos({ navigation }) {
  const { teamId } = useContext(TeamContext);
  const [task, setTask] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onStartDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || startDate;
      setShowStartDatePicker(false);
      setStartDate(currentDate.toISOString().split('T')[0]);
    } else {
      setShowStartDatePicker(false);
    }
  };
  
  const onEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || endDate;
      setShowEndDatePicker(false);
      setEndDate(currentDate.toISOString().split('T')[0]);
    } else {
      setShowEndDatePicker(false);
    }
  };
  
  const addTodo = async () => {
    if (task.trim() === '') {
      alert('Please enter a task');
      return;
    }
  
    if (startDate.trim() === '') {
      alert('Please enter a start date');
      return;
    }
  
    if (endDate.trim() === '') {
      alert('Please enter an end date');
      return;
    }    
    const uid = auth.currentUser.uid;

    const todosRef = firestore.collection(`teams`).doc(teamId).collection("todos");

    await todosRef.add({
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
      <TextInput
        value={startDate}
        onFocus={() => setShowStartDatePicker(true)}
        onBlur={() => setShowStartDatePicker(false)}
        editable={false}
      />
      {showStartDatePicker && (
        <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onStartDateChange}
        />
      )}
      <TextInput
          value={endDate}
          onFocus={() => setShowEndDatePicker(true)}
          onBlur={() => setShowEndDatePicker(false)}
          editable={false}
      />
      {showEndDatePicker && (
        <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onEndDateChange}
        />
    )}
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