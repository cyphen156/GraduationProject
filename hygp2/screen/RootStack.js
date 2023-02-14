import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTab from "./MainTab";
import WriteScreen from './Write';
import SignIn from "./SignIn";

const Stack = createNativeStackNavigator();

function RootStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
            <Stack.Screen name="MainTab" component={MainTab} options={{headerShown: false}} />
            <Stack.Screen name="Write" component={WriteScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default RootStack;