import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from './Feed'
import CalendarScreen from "./Calendar";
import Todo from './Todo';
import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import { useUserContext } from "../context/UserContext";
import Camera from "../components/image-picker-ex";
import HomeStack from "./HomeStack";
import MyProfileStack from "./MyProfileStack";
import SubTab from "./SubTab";
import FileUpload from "../components/FileUpload";
import FeedList from "../components/FeedList";
import FriendsList from "./FriendsList";
import MyCalendar from "./Calendars/MyCalendar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TeamListScreen from "./Teams/TeamList";
import CreateTeamScreen from "./Teams/CreateTeam";
//import GoogleSigninBTN from "../SignIn/GoogleSignin";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/** 메인 화면 아래 탭 */
function MainTab() {
    return (
        <Tab.Navigator 
            screenOptions={{
                headerShown: true,
                tabBarShowLabel: false,
                //tabBarActiveTintColor: '#e91e63'
                }}
            >     
            <Tab.Screen name="게시물" component={HomeStack} options={{ headerShown: false,
                tabBarIcon: ({color}) => (<Icon name="home" color={color} size={30} />),
            }}/>     
            <Tab.Screen name="팀 리스트" component={TeamListScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="groups" size={size} color={color} />),
            }}/>
            <Tab.Screen name="MyCalendar" component={MyCalendar} options={{
                tabBarIcon: ({color, size}) => (<Icon name="event" size={size} color={color} />),
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