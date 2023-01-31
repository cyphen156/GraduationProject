import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native";
import WriteHeader from "../components/WriteHeader";
import WriteEditor from "../components/WriteEditor";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import LogContext from "../context/LogContext";

function WriteScreen(){
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigation = useNavigation();

    const {onCreate} = useContext(LogContext);
    const onSave = () => {
        onCreate({
            title,
            body,
            date: new Date().toISOString(),
        });
        navigation.pop();
    };

    return (
        <SafeAreaView style={styles.block}>
            <KeyboardAvoidingView 
                style={styles.avoidView}
                behavior={Platform.OS === "ios" ? 'padding' : undefined}>
                <WriteHeader onSave={onSave} />
                <WriteEditor 
                    title = {title}
                    body = {body}
                    onChangeTitle={setTitle}
                    onChangeBody={setBody}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1, 
        backgroundColor: "white"},
    avoidView: {
        flex: 1,
    },
});

export default WriteScreen;