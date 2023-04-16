import { createStackNavigator } from 'react-navigation-stack';
import { Button } from 'react-native';
import HomeScreen from './Home';

const ButtonApp = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: () => (
        <Button
          onPress={() => navigation.push('Profile')}
          title="Profile"
        />
      ),
      headerRight: () => (
        <Button
          onPress={() => navigation.push('SearchHeader')}
          title="Search"
        />
      ),
    }),
  },
});

export default ButtonApp;