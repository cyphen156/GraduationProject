import React, {useRef, useState} from 'react';
import { Keyboard, KeyboardAvoidingView, Platform,
    StyleSheet, Text, View, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignButtons from '../components/SignButtons';
import SignForm from '../components/SignForm';
import { signIn, signUp } from '../lib/auth';
import { getUser } from '../lib/user';
import { useUserContext } from '../context/UserContext';

/** 로그인 화면 */
function SignIn ({navigation, route}) {
    const {isSignUp} = route.params || {};
    const [form, setForm] = useState({
        email : '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState();
    const {setUser} = useUserContext();

    const createChangeTextHandler = (name) => (value) => {
        setForm({...form, [name]: value});
    };

    const onSubmit = async () => {
        Keyboard.dismiss();
        const {email, password, confirmPassword} = form;
        
        if(!email){
            Alert.alert('실패', '이메일을 입력해주세요.');
            return;
        }
        if (isSignUp && password !== confirmPassword){
             Alert.alert('실패', '비밀번호가 일치하지 않습니다.');
             console.log({password, confirmPassword});
             return;
        } else if(!email){
            Alert.alert('실패', '이메일을 입력해주세요.');
            return;
        } else if(!password){
            Alert.alert('실패', '비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        const info = {email, password};

        try{
            const {user} = isSignUp ? await signUp(info) : await signIn(info);
            const profile = await getUser(user.uid);
            if(!profile){
                navigation.navigate('Welcome', {uid: user.uid});
            } else {
                setUser(profile);
            }
            //console.log(user);

        } catch (e) {

            const messages = {
                'auth/invalid-password' : '6자리 이상 입력해주세요.',
                'auth/invalid-display-name' : '값 비어있음',
                'auth/email-already-in-use': '이미 가입된 이메일입니다.',
                'auth/wrong-password': '잘못된 비밀번호입니다.',
                'auth/user-not-found': '존재하지 않는 계정입니다.',
                'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',

            };
            const msg = messages[e.code] || `${isSignUp ? '가입' : '로그인'} 실패 `;
            Alert.alert('실패', msg);

        } finally {
            setLoading(false);
        }
    };
    
    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.select({ios: 'padding'})}>
       
            <SafeAreaView style={styles.fullscreen}> 
                <Image 
                    style={styles.image}
                    source={require('../assets/images/Teamony-removebg-preview.png')}/>
                <View style={styles.form}>
                    {/* input */}
                    <SignForm
                        isSignUp={isSignUp}
                        onSubmit={onSubmit}
                        form={form}
                        createChangeTextHandler={createChangeTextHandler}/>
                   
                    {/* 버튼 */}
                    <SignButtons isSignUp={isSignUp} onSubmit={onSubmit} loading={loading}/>
                    
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    ); 
}

const styles = StyleSheet.create ({
    block: {},
    fullscreen: {
        flex:   1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    form: {
        //marginTop: 64,
        width: '100%',
        paddingHorizontal: 16,
    },
    buttons: {
        marginTop : 30,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    image: {
        width: '65%',
        height: '30%',
        flex: 1,
        //position: 'absolute',
        resizeMode:"contain"
      },
});

export default SignIn;