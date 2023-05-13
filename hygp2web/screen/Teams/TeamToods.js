import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';

const TeamTodos = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const snapshot = await firestore().collection('todos').get();
      const fetchedTodos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(fetchedTodos);
      const markedDatesObj = {};
      fetchedTodos.forEach(todo => {
        const { startDate, endDate } = todo;
        const dateArray = getDatesArray(startDate, endDate);
        dateArray.forEach(date => {
          markedDatesObj[date] = { marked: true };
        });
      });
      setMarkedDates(markedDatesObj);
    };
    fetchTodos();
  }, []);

  const getDatesArray = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    while (currentDate <= endDateObj) {
      const dateString = currentDate.toISOString().split('T')[0];
      dateArray.push(dateString);
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dateArray;
  };

  const handleTitleChange = title => {
    setNewTodo({
      ...newTodo,
      title
    });
  };

  const handleDescriptionChange = description => {
    setNewTodo({
      ...newTodo,
      description
    });
  };

  const handleStartDateChange = startDate => {
    setNewTodo({
      ...newTodo,
      startDate
    });
  };

  const handleEndDateChange = endDate => {
    setNewTodo({
      ...newTodo,
      endDate
    });
  };

  const handleAddTodo = async () => {
    const { title, description, startDate, endDate } = newTodo;
    if (!title || !description || !startDate || !endDate) return;
    const todo = {
      title,
      description,
      startDate,
      endDate
    };
    await firestore().collection('todos').add(todo);
    setTodos([...todos, todo]);
    const markedDatesObj = { ...markedDates };
    const dateArray = getDatesArray(startDate, endDate);
    dateArray.forEach(date => {
      markedDatesObj[date] = { marked: true };
    });
    setMarkedDates(markedDatesObj);
    setNewTodo({
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleDeleteTodo = async id => {
    await firestore().collection('todos').doc(id).delete();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
    const markedDatesObj = {};
    filteredTodos.forEach(filteredTodo) => {
        const { startDate, endDate } = filteredTodo;
        const dateArray = getDatesArray(startDate, endDate);
        dateArray.forEach(date => {
        markedDatesObj[date] = { marked: true };
        });
        });
        setMarkedDates(markedDatesObj);
        };
        
        const handleSelectTodo = id => {
        const todo = todos.find(todo => todo.id === id);
        setSelectedTodo(todo);
        };
        
        const handleUpdateTodo = async () => {
        const { title, description, startDate, endDate } = selectedTodo;
        if (!title || !description || !startDate || !endDate) return;
        await firestore().collection('todos').doc(selectedTodo.id).update({
        title,
        description,
        startDate,
        endDate
        });
        const updatedTodos = todos.map(todo => {
        if (todo.id === selectedTodo.id) {
        return {
        ...todo,
        title,
        description,
        startDate,
        endDate
        };
        } else {
        return todo;
        }
        });
        setTodos(updatedTodos);
        const markedDatesObj = {};
        updatedTodos.forEach(updatedTodo => {
        const { startDate, endDate } = updatedTodo;
        const dateArray = getDatesArray(startDate, endDate);
        dateArray.forEach(date => {
        markedDatesObj[date] = { marked: true };
        });
        });
        setMarkedDates(markedDatesObj);
        setSelectedTodo(null);
        };
        
        return (
        <View style={styles.container}>
        <Calendar
        markedDates={markedDates}
        onDayPress={({ dateString }) => console.log('selected day', dateString)}
        />
        <View style={styles.todosContainer}>
        {todos.map(todo => (
        <View
        key={todo.id}
        style={[styles.todo, selectedTodo && selectedTodo.id === todo.id && styles.selectedTodo]}
        >
        <TouchableOpacity onPress={() => handleSelectTodo(todo.id)}>
        <Text style={styles.todoTitle}>{todo.title}</Text>
        </TouchableOpacity>
        <Text style={styles.todoDate}>{todo.startDate} - {todo.endDate}</Text>
        <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
        </View>
        ))}
        </View>
        <View style={styles.formContainer}>
        <TextInput
               style={styles.input}
               placeholder="Title"
               value={newTodo.title}
               onChangeText={handleTitleChange}
             />
        <TextInput
               style={styles.input}
               placeholder="Description"
               value={newTodo.description}
               onChangeText={handleDescriptionChange}
             />
        <TextInput
               style={styles.input}
               placeholder="Start Date (YYYY-MM-DD)"
               value={newTodo.startDate}
               onChangeText={handleStartDateChange}
             />
        <TextInput
               style={styles.input}
               placeholder="End Date (YYYY-MM-DD)"
               value={newTodo.endDate}
               onChangeText={handleEndDateChange}
             />
        <Button title="Add Todo" onPress={handleAddTodo} />
        </View>
        {selectedTodo && (
        <View style={styles.formContainer}>
        <TextInput
        style={styles.input}
        placeholder="Title"
        value={selectedTodo.title}
        onChangeText={title =>
        setSelectedTodo({
        ...selectedTodo,
        title
        })
        }
        />
        <TextInput
        style={styles.input}
        placeholder="Description"
        value={selectedTodo.description}
        onChangeText={description =>
        setSelectedTodo({
        ...selectedTodo,
        description
        })
        }
        />
        <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={selectedTodo.startDate}
        onChangeText={startDate =>
        setSelectedTodo({
        ...selectedTodo,
        startDate
        })
        }
        />
        <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={selectedTodo.endDate}
        onChangeText={endDate =>
        setSelectedTodo({
        ...selectedTodo,
        endDate
        })
        }
        />
        <Button title="Update Todo" onPress={handleUpdateTodo} />
        <Button title="Cancel" onPress={() => setSelectedTodo(null)} />
        </View>
        )}
        </View>
        );
        };
        
        const styles = StyleSheet.create({
        container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
        },
        todosContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20
        },
        todo: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
        },
        selectedTodo: {
        backgroundColor: 'lightgray'
        },
        todoTitle: {
        fontSize: 18
        },
        todoDate: {
        color: 'gray'
        },
        deleteButton: {
        color: 'red'
        },
        formContainer: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20
        },
        input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
        }
        });
        
        export default TeamTodos;
