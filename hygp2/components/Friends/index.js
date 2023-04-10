import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { background, theme } from '../../Styles/theme';
import List from './List';
import Search from './Search';
const Stack = createStackNavigator();
const Friends = ({ navigation }) => {
    return (React.createElement(Stack.Navigator, { screenOptions: { cardStyle: Object.assign({}, background.theme[800]), headerStyle: Object.assign({}, background.theme[900]), headerTintColor: theme[200] } },
        React.createElement(Stack.Screen, { name: "List", component: List, options: { headerShown: false } }),
        React.createElement(Stack.Screen, { name: "Search", component: Search })));
};
export default Friends;
