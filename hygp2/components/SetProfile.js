import { useNavigation, useRoute } from "@react-navigation/native";
import React, {useState, useRef} from "react";
import { StyleSheet, View , Pressable, Platform,
     Image, ActivityIndicator, Button, Alert, Keyboard, Dimensions} from "react-native";
import { signOut } from "../lib/auth";
import { createUser } from "../lib/user";
import BordredInput from "./BordredInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../context/UserContext";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import  Avatar  from  './Avatar';
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-easy-toast';

function SetupProfile(){

    const [displayName, setDisplayName] = useState('');
    const navigation = useNavigation();
    const {setUser} = useUserContext();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const {params} = useRoute();
    const {uid} = params || {};
    const userImage = require('../assets/images/user.png');
    // 아이디 변경 가능여부
    let changeable = true;

    // 아이디 확인 버튼 여부
    let checking = false;
    
    const toastRef = useRef(); // toast ref 생성
    const windowHeight = Dimensions.get('window').height;
    console.log(userImage);

    const onSubmit = async () => {
        Keyboard.dismiss();
        //setLoading(true);

        let photoURL = null;

        if (changeable && checking){

            if (response) {
                const asset = response.assets[0];
                const extension = asset.fileName.split('.').pop(); // 확장자 추출
                const reference = storage().ref(` /profile/${uid}.${extension}`); // 업로드할 경로

                if (Platform.OS === 'android'){
                    await reference.putString(asset.base64, 'base64', {
                        contentType : asset.type,
                    });
                } else {
                    await reference.putFile(asset.uri); // 파일 저장
                }
                // 다운로드할 수 있는 URL 생성
                photoURL = response ? await reference.getDownloadURL() : null;
            } 

            const user = {
                id : uid,
                displayName,
                photoURL,
            };

            createUser(user);
            setUser(user);

        }else{
            toastRef.current.show('닉네임 확인 해주세요.');
            
        }
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
            },
        );
    };

    const check = () => {
        checking = true;
        Keyboard.dismiss();
        firestore().collection('user').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              console.log(doc.id, '=>', doc.data());

              // 다른 유저 displayName 이름 중복이 있으면 
              if(displayName == doc.data().displayName){
                console.log('중복 O');
                toastRef.current.show('다른 닉네임으로 변경해주세요.');
                changeable = false;
              }
            });

          }).then(() => {
            console.log('changeable : ', changeable);
            if (changeable == true){
              toastRef.current.show('사용 가능합니다.');
            } 
        });

    };

    return(
        <View style={styles.block}>
            <Toast ref={toastRef}
                    positionValue={windowHeight * 0.55}
                    fadeInDuration={300}
                    fadeOutDuration={1000}
                    style={{backgroundColor:'rgba(33, 87, 243, 0.5)'}}
            />

            <Pressable onPress={onSelectImage}>
                <Image
                style={styles.circle}
                source={
                    response
                    ? {uri: response?.assets[0]?.uri}
                    : require('../assets/images/user.png')
                }
                />
            </Pressable>

            <View>
                <View style={styles.checking}>
                    <BordredInput 
                        placeholder="닉네임"
                        value={displayName}
                        onChangeText={setDisplayName}
                        onSubmitEditing={onSubmit}
                        returnKeyType="next"
                        width="70%"
                        margin={10}
                    />
                        <Button style={styles.margin} title="닉네임 확인" onPress={check}/>
                </View>
                        {loading ? (
                            <ActivityIndicator size={32} color="#6200ee" style={styles.spinner}/>
                        ) : (
                            <View style={styles.button}>
                                <CustomButton title="다음" onPress={onSubmit} hasMarginBottom/>
                                <CustomButton title="취소" onPress={onCancel} theme="secondary"/>
                            </View>
                        )}
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
    margin:{
        alignItems: 'center',
        justifyContent: 'center',   
    },
    checking: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SetupProfile;