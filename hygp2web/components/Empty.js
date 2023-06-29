import React from "react";
import {View, Text, Image, StyleSheet} from 'react-native'

function Empty() {
    return (
        <View style={style.block}>
            <Image source={require('../assets/images/young_and_happy.png')}
            style={style.image} />
            <Text style={style.description}>야호! 할일이 없습니다.</Text>
        </View>
    );
}

const style = StyleSheet.create({
    block: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 240,
        height: 179,
        marginBottom: 16,
    },
    description: {
        fontSize: 24,
        color: '#9e9e9e',
    },
});

export default Empty;