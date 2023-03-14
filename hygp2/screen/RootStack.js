import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WriteScreen from './Write';
import SignIn from "./SignIn";
import WelcomeScreen from "./WelcomeScreen";
import HomeScreen from "./Home";
import { useUserContext } from "../context/UserContext";
import MainTab from "./MainTab";

const Stack = createNativeStackNavigator();

function RootStack() {
    const {user} = useUserContext();
    return (
        <Stack.Navigator>     
            {user ? (
                <>
                    <Stack.Screen name="MainTab" component={MainTab} options={{headerShown: false}} />
                    <Stack.Screen name="Write" component={WriteScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>

                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
                </>
            )}       
         </Stack.Navigator>
    );
}

export default RootStack;