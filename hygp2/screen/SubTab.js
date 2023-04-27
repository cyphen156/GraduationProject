import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Search from "./Search"
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import TeamListScreen from "./Teams/TeamList";
import { useState } from "react";
import TeamContext from "./Teams/TeamContext";
import TeamStackNavigator from "./Teams/TeamStack";
import TeamCalendar from "./Calendars/TeamCalendar";
import CreateTodos from "./Teams/CreateTodos";

const Tab = createBottomTabNavigator();

function SubTab () {
    return (
            <Tab.Navigator screenOptions={{
                headerShown: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#e91e63'}
            }>
                <Tab.Screen name="search" component={Search} options={{
                    tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
                }}/> 
                <Tab.Screen
                    name="TeamStackNavigator"
                    component={TeamStackNavigator}
                    options={{
                        headerShown: false,
                        tabBarLabel: "Chat",
                        tabBarIcon: ({ color, size }) => (
                        <Icon name="view-stream" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen name="CreateTodos" 
                    component={CreateTodos} 
                    options={{
                        tabBarLabel: 'CreateTodos',
                        tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
                }}/> 
                <Tab.Screen name="TeamCalendar" 
                    component={TeamCalendar} 
                    options={{
                        tabBarLabel: 'TeamCalendar',
                        tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
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