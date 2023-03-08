
import React, {useState, useEffect, useContext} from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DateHead from '../components/DateHead';
import AddTodo from '../components/AddTodo';
import Empty from '../components/Empty';
import TodoList from '../components/TodoList';
import TodosStorage from '../storages/TodosStorage';

function Todo() {
  const today = new Date();

  const [todos, setTodos] = useState([
    {id: 1, text: 'Ex)작업환경 설정', done: true},
    {id: 2, text: 'Ex)투두리스트 하나더만들기', done: true},
  ]);

  useEffect(() => {
    TodosStorage
      .get()
      .then(setTodos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    TodosStorage.set(todos).catch(console.error);
  }, [todos]);

  useEffect(() => {
    async function load() {
      try {
        console.log(1);
        const rawTodos = await AsyncStorage.getItem('todos');//catch
        console.log(2);
        const savedTodos = JSON.parse(rawTodos);
        console.log(3);
        setTodos(savedTodos);
        console.log(4);
      } catch (e) {
        console.log(5);
        console.log('Failed to load todos');
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function save() {
      try {
        console.log(6);
        await AsyncStorage.setItem('todos', JSON.stringify(todos));//catch
        console.log(7);
      } catch (e){
        console.log(8);
        console.log('Failed to save todos');
      }
    }
    save();
  }, [todos]);

  const onInsert = text => {
    const nextId =
      todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;               
      const todo = {
        id: nextId,
        text,
        done: false,
      };

      setTodos(todos.concat(todo));
  };

  const onToggle = id => {
    const nextTodos = todos.map(todo => todo.id === id ? {...todo, done: !todo.done} : todo,);
    setTodos(nextTodos);
  };

  const onRemove = id => {
    const nextTodos = todos.filter(todo => todo.id != id);
    setTodos(nextTodos);
  };

  return (
    <SafeAreaView edges={['bottom']} style={style.block}>
      <DateHead date={today} />
      {todos.length === 0? (
       <Empty />
      ) : (
        <TodoList todos={todos} onToggle={onToggle} onRemove={onRemove} />
      )}
       <AddTodo onInsert={onInsert} />
    </SafeAreaView>
    
  );
}

const style = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Todo;