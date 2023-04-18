import Chat from "./Chat";
import InviteFriends from "./InviteFriends";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const TeamStack = createNativeStackNavigator();

function TeamStackNavigator() {
    return(
        <TeamStack.Navigator>
            <TeamStack.Screen name="Chat" component={Chat} />
            <TeamStack.Screen name="InviteFriends" component={InviteFriends} />
        </TeamStack.Navigator>
    );
}

export default TeamStackNavigator;