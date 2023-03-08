import AsyncStorage from "@react-native-community/async-storage";

const key = 'todos';

const TodosStorage = {
    async get(){
        try {
            const rawTodos = await AsyncStorage.getItem(key);

            if (!rawTodos) {
                //no data == no use;
                throw new Error("No saved todos data");
            }

            const savedTodos = JSON.parse(rawTodos);
            return savedTodos;
        } catch (e) {
            throw new Error("Failed to load todos");
        }
    },
    async set(data) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            throw new Error('failed to save todos data');
        }
    },
};

export default TodosStorage;