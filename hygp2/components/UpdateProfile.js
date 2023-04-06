import { useNavigation, useRoute } from "@react-navigation/native";
import React, {useState , useEffect} from "react";
import { StyleSheet, View , Pressable, Platform,
     Image, ActivityIndicator} from "react-native";
import { signOut } from "../lib/auth";
import { updateUser , getUser } from "../lib/user";
import BordredInput from "./BordredInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../context/UserContext";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import  Avatar  from  './Avatar';
import events from "../lib/events";
import { createTest, updateTest , readTest } from "../lib/posts";


function UpdateProfile(){
    const [displayName, setDisplayName] = useState('');
    const navigation = useNavigation();
    const {user, setUser} = useUserContext();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    
    //const {params} = useRoute();
    console.log("user", user);
    myPhotoURL = user.photoURL;
    
    useEffect(() => {
        //uid = user.id;
        setDisplayName(user.displayName);
      }, [setUser, navigation]);

    const onSubmit = async () => {
        setLoading(true);

        let photoURL = null;

        if (response) {
            const asset = response.assets[0];
            const extension = asset.fileName.split('.').pop(); // 확장자 추출
            const reference = storage().ref(` /profile/${user.id}.${extension}`); // 업로드할 경로

            if (Platform.OS === 'android'){
                await reference.putString(asset.base64, 'base64', {
                    contentType : asset.type,
                });
            } else {
                await reference.putFile(asset.uri); // 파일 저장
            }
            // 다운로드할 수 있는 URL 생성
            photoURL = response ? await reference.getDownloadURL() : null;
        }else{
            photoURL = myPhotoURL;
            console.log("photoURL : ", photoURL);
        }

        await updateUser({
            id: user.id,
            displayName,
            photoURL,
        });
        // TODO: 포스트 및 포스트 목록 업데이트
        events.emit('updateUser', {
            userId: user.id,
            displayName,
            photoURL,
        });
        console.log("URL: ", photoURL);
        setUser(user);

        await readTest({
            id: user.id, 
            user : user,
        });
        
        navigation.pop();

        // posts에 참조된 user의 값을 변경해준다
    
        // await createTest({user, name});

    
        console.log("user: ", user)
        onLogout();
    };

    const onCancel = () => {
        signOut();
        navigation.goBack();
    };

    const onSelectImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: Platform.OS === 'android',
            },
            (res) => {
                if (res.didCancel) {
                    // 취소했을 경우
                    return;
                }
                setResponse(res);
                console.log("image : ", res)
            },
        );
    };

    const onLogout = async () => {
        await signOut();
        setUser(null);
    };
    
    return(
        <View style={styles.block}>
            <Pressable onPress={onSelectImage} >
                <Image
                //source={source || require('../assets/images/user.png')}
                resizeMode="cover"
                style={styles.circle}
                source={
                    response
                    ? {uri: response?.assets[0]?.uri}
                    : {uri: user.photoURL}
                }
                />
            </Pressable>
            <View style={styles.form}>

                <BordredInput
                    placeholder="닉네임"
                    value={displayName}
                    onChangeText={setDisplayName}
                    onSubmitEditing={onSubmit}
                    returnKeyType="next"
                    /> 

                        <View style={styles.button}>
                            <CustomButton title="변경" onPress={onSubmit} hasMarginBottom/>
                            <CustomButton title="취소" onPress={onCancel} theme="secondary"/>
                        </View>
                   
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 16,
        width: '100%',
    },
    circle: {
        backgroundColor: '#cdcdcd',
        borderRadius: 64,
        width: 128,
        height: 128,
    },
    form: {
        marginTop: 16,
        width: '100%',
    },
    button: {
        marginTop: 48,
    },
});
UpdateProfile.defaultProps = {
    size : 32,
};

export default UpdateProfile;