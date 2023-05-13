import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';


function DateHead({date}) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    

  return (
    <>
    <StatusBar backgroundColor="#26a69a" />
        <View style={style.block}>
            <Text style={style.dateText}>
                {year}년 {month}월 {day}일
            </Text>
        </View>
    </>
  );
}

const style = StyleSheet.create({   
    block: {
        padding: 16,
        backgroundColor: '#bbdefb',
    },
    dateText: {
        fontSize: 24,
        color: 'white',
    },
});

export default DateHead;