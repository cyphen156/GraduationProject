import React from "react";
import {View, Text, Image, StyleSheet} from 'react-native'

function EmptyFriend() {
    return (
        <View style={style.block}>
            <Image source={require('../assets/images/owl.png')}
            style={style.image} />
            <Text style={style.description}>귀여운 부엉이가 있네요.</Text>
        </View>
    );
}

const style = StyleSheet.create({
    block: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        marginTop: 30,
        width: 200,
        height: 179,
        marginBottom: 16,
    },
    description: {  
        fontSize: 20,
        color: '#9e9e9e',
    },
});

export default EmptyFriend;