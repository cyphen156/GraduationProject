import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Greetings(props) {
  return (
    <View style={styles.text}>
      <Text>안녕하세요! {props.name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: 'red',
  },
});

Greetings.defaultProps = {
  name: 'react-native',
};

export default Greetings;
