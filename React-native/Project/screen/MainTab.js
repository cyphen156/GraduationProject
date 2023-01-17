import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from './Feed'
import CalendarScreen from "./Calendar";
import SearchScreen from './Search';
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

function MainTab() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#e91e63',
          }}>
            <Tab.Screen name="Feed" component={FeedScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            <Tab.Screen name="Calendar" component={CalendarScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>
        </Tab.Navigator>
    );
}

export default MainTab;
/*
screenOptions={({route}) => ({
    return (showLable:false, activeTintColor:"#009688",)
})}
*/