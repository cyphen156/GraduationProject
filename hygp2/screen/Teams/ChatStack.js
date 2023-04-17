import Chat from "./Chat";
import InviteFriends from "./InviteFriends";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const ChatStack = createNativeStackNavigator();

function ChatStackNavigator() {
    return(
        <ChatStack.Navigator>
            <ChatStack.Screen name="Chat" component={Chat} />
            <ChatStack.Screen name="InviteFriends" component={InviteFriends} />
        </ChatStack.Navigator>
    );
}

export default ChatStackNavigator;