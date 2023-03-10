import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from './Feed'
import CalendarScreen from "./Calendar";
import SearchScreen from './Search';
import Todo from './Todo';
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchHeader from "../components/SearchHeader";
import SignIn from "./SignIn";
import { StyleSheet, Text, View } from "react-native";
import { useUserContext } from "../context/UserContext";
import  HomeScreen from './Home';
//import pickImg from "./ImagePicker";

const Tab = createBottomTabNavigator();


/** 메인 화면 아래 탭 */
function MainTab() {
    
    const {user} = useUserContext();

    return (

        <Tab.Navigator screenOptions={{
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#e91e63'}}>     

            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="Feed" component={FeedScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            <Tab.Screen name="Todo" component={Todo} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            <Tab.Screen name="Calendar" component={CalendarScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
                headerTitle: () => <SearchHeader />,
            
            /*<Tab.Screen name="ImagePicker" component={pickImg} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
                headerTitle: () => <SearchHeader />,
            */
           
            }}/>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        zindex: 0,
    },
});

export default MainTab;
/*
screenOptions={({route}) => ({
    return (showLable:false, activeTintColor:"#009688",)
})}
*/