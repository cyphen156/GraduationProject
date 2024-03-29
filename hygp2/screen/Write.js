import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native";
import WriteHeader from "../components/WriteHeader";
import WriteEditor from "../components/WriteEditor";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import LogContext from "../context/LogContext";
import CameraButton from "../components/CameraButton";
import { useUserContext } from "../context/UserContext";

function WriteScreen({route}){
    const log = route.params?.log;
    console.log("log :", log)
    const [title, setTitle] = useState(log?.title ?? '');
    const [body, setBody] = useState(log?.body ?? '');
    const navigation = useNavigation();
    const [date, setDate] = useState(log ? new Date(log.date) : new Date());
    const {user} = useUserContext();
    const {onCreate, onModify, onRemove} = useContext(LogContext);

    const onAskRemove = () => {
        Alert.alert(
          '삭제',
          '정말로 삭제하시겠어요?',
          [
            {text: '취소', style: 'cancel'},
            {
              text: '삭제',
              onPress: () => {
                onRemove(log?.id);
                navigation.pop();
              },
              style: 'destructive',
            },
          ],
          {
            cancelable: true,
          },
        );
      };
    const onSave = () => {
        if (log) {
            onModify({
                id: log.id,
                date: date.toISOString(),
                displayName : user.displayName,
                title,
                body,
            });
        } else{
            onCreate({
                
                title,
                body,
                date: date.toISOString(),
            });
        }
        navigation.pop();
    };

    return (
        <SafeAreaView style={styles.block}>
            <KeyboardAvoidingView 
                style={styles.avoidView}
                behavior={Platform.OS === "ios" ? 'padding' : undefined}>
                <WriteHeader 
                    onSave={onSave} 
                    onAskRemove={onAskRemove}
                    isEditing={!!log} 
                    date={date}
                    onChangeDate={setDate} />
                <WriteEditor 
                    title = {title}
                    body = {body}
                    onChangeTitle={setTitle}
                    onChangeBody={setBody} />
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