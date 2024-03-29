import React, { useState } from "react";
import {View, StyleSheet, TextInput, Image, TouchableOpacity, Platform, TouchableNativeFeedback, Keyboard} from 'react-native';
import IconLeftButton from "./IconLeftButton";
import IconRightButton from "./IconRightButton";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

function AddTodo({onInsert}) {
    const [text, setText] = useState('');
    const navigation = useNavigation();
    
    const onPress = () => {
        onInsert(text);
        setText('');
        Keyboard.dismiss();
    };

    const button = (
        <View style={style.buttonStyle}>
            <Image source={require('../assets/icons/add_white/add_white.png')} />
        </View>
    );

    return ( 
        <View style={style.block}>
            <TextInput placeholder="할일을 입력하세요." 
                style={style.input}
                value={text}
                onChangeText={setText}
                onSubmitEditing={onPress}
                returnKeyType="done" />

            <View style={style.circleWrapper}>
                <TouchableNativeFeedback onPress={onPress}>
                        {button}
                </TouchableNativeFeedback>
            </View>                           
        </View>
    );  
}

const style = StyleSheet.create({
    block: {
        backgroundColor: 'white',
        height: 64,
        paddingHorizontal: 16,
        borderColor: '#bdbdbd',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        backgroundColor: '#26a69a',
        borderRadius: 24,
    },
    circleWrapper: {
        overflow: 'hidden',
        borderRadius: 24,
    },
    
});

export default AddTodo;