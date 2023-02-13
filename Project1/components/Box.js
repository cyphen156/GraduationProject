import {View, StyleSheet} from 'react-native';

function Box() {
  return <View style={styles.box} />;
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    width: 64,
    height: 64,
    backgroundColor: 'black',
  },
});

export default Box;
