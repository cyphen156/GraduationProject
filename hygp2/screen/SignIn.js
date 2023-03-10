import React, {useRef, useState} from 'react';
import { Keyboard, KeyboardAvoidingView, Platform,
    StyleSheet, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BorderedInput from "../components/BordredInput";
import CustomButton from "../components/CustomButton";
import SignButtons from '../components/SignButtons';
import SignForm from '../components/SignForm';

/** 로그인 화면 */
function SignIn ({navigation, route}) {
    const {isSignUp} = route.params || {};
    const [form, setForm] = useState({
        email : '',
        password: '',
        confirmPassword: '',
    });

    const createChangeTextHandler = (name) => (value) => {
        setForm({...form, [name]: value});
    };
    const onSubmit = () => {
        Keyboard.dismiss();
        console.log(form);
    };
    
    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.select({ios: 'padding'})}>

            <SafeAreaView style={styles.fullscreen}>
                <Text style={styles.text}>PublicGallery</Text>
                <View style={styles.form}>
                    {/* input */}
                    <SignForm
                        isSignUp={isSignUp}
                        onSubmit={onSubmit}
                        form={form}
                        createChangeTextHandler={createChangeTextHandler}/>
                   
                    {/* 버튼 */}
                    <SignButtons isSignUp={isSignUp} onSubmit={onSubmit}/>
                    
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
        marginTop: 64,
        width: '100%',
        paddingHorizontal: 16,
    },
    buttons: {
        marginTop : 64,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
});

export default SignIn;