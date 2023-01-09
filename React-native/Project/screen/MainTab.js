import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from './Feed'
import CalendarScreen from "./Calendar";
import SearchScreen from './Search';

const Tab = createBottomTabNavigator();

function MainTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
    );
}

export default MainTab;