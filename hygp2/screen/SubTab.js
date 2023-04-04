import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Search from "../screen/Search"
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Agendascr from "./Agenda";
import TeamListScreen from "./TeamList";
import CreateTeamScreen from "./CreateTeam";
// import DataUpload from "../nullable/DataUpload";

const Tab = createBottomTabNavigator();

function SubTab () {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#e91e63'}}>
            <Tab.Screen name="search" component={Search} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="AgeendaScreen" component={Agendascr} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="CreateTeam" component={CreateTeamScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            <Tab.Screen name="TeamList" component={TeamListScreen} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/> 
            {/* <Tab.Screen name="DataUpload" component={DataUpload} options={{
                tabBarIcon: ({color, size}) => (<Icon name="view-stream" size={size} color={color} />),
            }}/>  */}
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