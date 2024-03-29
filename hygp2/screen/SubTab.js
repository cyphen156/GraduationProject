import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import TeamListScreen from "./Teams/TeamList";
import { useState } from "react";
import TeamContext from "./Teams/TeamContext";
import TeamStackNavigator from "./Teams/TeamStack";
import TeamCalendar from "./Calendars/TeamCalendar";
import CreateTodos from "./Teams/CreateTodos";
import TeamDashboard from "./Teams/TeamDashboard";

const Tab = createBottomTabNavigator();

function SubTab () {
    return (
            <Tab.Navigator screenOptions={{
                headerShown: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#e91e63'}
            }>

                <Tab.Screen
                    name="TeamStackNavigator"
                    component={TeamStackNavigator}
                    options={{
                        headerShown: false,
                        tabBarLabel: "Chat",
                        tabBarIcon: ({ color, size }) => (
                        <Icon name="forum" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen name="TeamCalendar" 
                    component={TeamCalendar} 
                    options={{
                        tabBarIcon: ({color, size}) => (<Icon name="event" size={size} color={color} />),
                }}/>
                <Tab.Screen name="TeamDashboard" 
                    component={TeamDashboard} 
                    options={{
                        tabBarLabel: 'TeamDashboard',
                        tabBarIcon: ({color, size}) => (<Icon name="dashboard" size={size} color={color} />),
                }}/>
            </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        zindex: 0,
    },
});

export default SubTab;