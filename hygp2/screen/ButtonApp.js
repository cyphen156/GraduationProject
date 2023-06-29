import { createStackNavigator } from 'react-navigation-stack';
import { Button } from 'react-native';

const ButtonApp = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: () => (
        <Button
          _onPress={() => navigation.navigate('SetProfile')}
          title="Profile"
        />
      ),
      headerRight: () => (
        <Button
          _onPress={() => navigation.navigate('SearchHeader')}
          title="Search"
        />
      ),
    }),
  },
});