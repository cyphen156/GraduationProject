import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { StyleSheet, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import IconRightButton from "../components/IconRightButton";
import { updatePost,
    //  updateUserProfile
     } from "../lib/posts";
import events from "../lib/events";
import { useUserContext } from "../context/UserContext";

function ModifyScreen(){
    const navigation = useNavigation();
    const {params} = useRoute();
    // 라우트 파라미터의 description을 초깃값으로 사용
    const [description, setDescription] = useState(params.description);
    const { user } = useUserContext();
    const onSubmit = useCallback(async () => {
        console.log(`${user.photoURL}, ${params.id} `)
        // TODO: 포스트 수정
        await updatePost({
            id: params.id,
            description,
        });
        // TODO: 포스트 및 포스트 목록 업데이트
        events.emit('updatePost', {
            postId: params.id,
            description,
        });
        // await updateUserProfile({
        //     id: params.id,
        //     photoURL : user.photoURL,
        // })
        navigation.pop();
    },[navigation, params.id, description]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
        });
    }, [navigation, onSubmit]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ios: 'height'})}
            style={styles.block}
            keyboardVerticalOffset={Platform.select({
                ios: 88,
            })}>
            <TextInput 
                style={styles.input}
                multiline={true}
                placeholder="이 사진에 대한 설명을 입력하세요..."
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    block: {
        flex : 1,
    },
    input : {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        flex: 1,
        fontSize: 16,
    },
});

export default ModifyScreen;