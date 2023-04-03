/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootStack from './screen/RootStack'
import { LogContextProvider } from './context/LogContext';
import { SearchContextProvider } from "./context/SearchContext";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { UserContextProvider } from './context/UserContext';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'

const firebaseConfig = {
  // Your Firebase project config
  apiKey: "AIzaSyDOWnBCSHjMGCGF1EUycGntildV844uUSM",
  authDomain: "hygp2-ec607.firebaseapp.com",
  projectId: "hygp2-ec607",
  storageBucket: "hygp2-ec607.appspot.com",
  messagingSenderId: "603930050293",
  appId: "1:603930050293:web:4acfa6e947d76587bacfbc",
  measurementId: "G-YV0BZHL37W"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <UserContextProvider>
      <NavigationContainer>
        <SearchContextProvider>
          <LogContextProvider>
            <RootStack />
          </LogContextProvider>
        </SearchContextProvider>
      </NavigationContainer>
    </UserContextProvider>
    /*
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section>
            <NavigationContainer>
              <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='Detail' component={DetailScreen} />
              </Stack.Navigator> 
            </NavigationContainer>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
    */
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
