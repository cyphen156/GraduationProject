import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from './Feed'
import CalendarScreen from "./Calendar";
import SearchScreen from './Search';
import Todo from './Todo';
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchHeader from "../components/SearchHeader";
import { StyleSheet, Text, View } from "react-native";
import { useUserContext } from "../context/UserContext";
import Camera from "../components/image-picker-ex";
import HomeStack from "./HomeStack";
import MyProfileStack from "./MyProfileStack";
import SubTab from "./SubTab";
const Tab = createBottomTabNavigator();


/** 메인 화면 아래 탭 */
function MainTab() {
    
    const {user} = useUserContext();

    return (

        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#e91e63'}}>     
            {/* <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>  */}
            <Tab.Screen name="MyProfileStack" component={MyProfileStack} options={{
                tabBarIcon: ({color}) => (<Icon name="person" color={color} />),
            }}/>   
            <Tab.Screen name="HomeStack" component={HomeStack} options={{
                tabBarIcon: ({color}) => (<Icon name="home" color={color} />),
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
                headerTitle: () => <SearchHeader />, headerShown: true
            }}/>
            <Tab.Screen name="Camera" component={Camera} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            {/** 스크린 이동시 main tabBar 숨기기 필요*/}
            <Tab.Screen name="SubTab" component={SubTab} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            {/* <Tab.Screen name="chat" component={Chat} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>  */}
    
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