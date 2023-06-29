import firestore from '@react-native-firebase/firestore'

const todosCollection = firestore().collection('user').collection('todos');

export function createTodos({user, todos, startday, endday}) {
    return todosCollection.add({
        user, 
        todos,
        startday,
        endday,
    });
}