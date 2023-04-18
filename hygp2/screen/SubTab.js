import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Search from "./Search"
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CreateTeamScreen from "./Teams/CreateTeam";
import TeamListScreen from "./Teams/TeamList";
import AgendaCalendar from "./Calendars/AgendaCalendar";
import { useState } from "react";
import TeamContext from "./Teams/TeamContext";
import ChatStackNavigator from "./Teams/ChatStack";
import TeamCalendar from "./Calendars/TeamCalendar";
import CreateTodos from "./Teams/CreateTodos";


const Tab = createBottomTabNavigator();

function SubTab () {
    const [teamId, setTeamId] = useState(null);
    return (
        <TeamContext.Provider value = {{teamId, setTeamId}}>
            <Tab.Navigator screenOptions={{
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#e91e63'}
            }>
            <Tab.Screen name="search" component={Search} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen
                name="ChatStackNavigator"
                component={ChatStackNavigator}
                options={{
                    headerShown: false,
                    tabBarLabel: "Chat",
                    tabBarIcon: ({ color, size }) => (
                    <Icon name="view-stream" size={size} color={color} />
                    ),
                }}
            />            
            <Tab.Screen name="CreateTeam" component={CreateTeamScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="TeamList" component={TeamListScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="CreateTodos" 
                component={CreateTodos} 
                options={{
                    tabBarLabel: 'CreateTodos',
                    tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="TeamCalendar" 
                component={AgendaCalendar} 
                options={{
                    tabBarLabel: 'TeamCalendar',
                    tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="TeamCalendar2" 
                component={TeamCalendar} 
                options={{
                    tabBarLabel: 'TeamCalendar2',
                    tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
        </Tab.Navigator>
    </TeamContext.Provider>
    )
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        zindex: 0,
    },
});

export default SubTab;