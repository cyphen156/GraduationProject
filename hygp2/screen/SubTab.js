import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Search from "./Search"
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Chat from "./Teams/Chat";
import CreateTeamScreen from "./Teams/CreateTeam";
import TeamListScreen from "./Teams/TeamList";
import AgendaCalendar from "./Calendars/AgendaCalendar";
import { useState } from "react";
import TeamContext from "./Teams/TeamContext";


const Tab = createBottomTabNavigator();

function SubTab () {
    const [teamId, setTeamId] = useState(null);
    return (
        <TeamContext.Provider value = {{teamId, setTeamId}}>
            <Tab.Navigator screenOptions={{
            headerShown: true,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#e91e63'}}>
            <Tab.Screen name="search" component={Search} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="Chat" component={Chat} options={{
                tabBarLabel: 'Chat', 
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="CreateTeam" component={CreateTeamScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="TeamList" component={TeamListScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="AgendaCalendar" component={AgendaCalendar} options={{
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