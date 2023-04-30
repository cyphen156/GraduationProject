import { useContext, useEffect } from 'react';
import { Button } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import TeamContext from '../../hygp2/screen/Teams/TeamContext';

const firestore = firebase.firestore();
const auth = firebase.auth();

const { teamID } = useContext(TeamContext);

const SendLocationButton = () => {
    const sendLocation = () => {
        Geolocation.getCurrentPosition(info => {
            const { latitude, longitude } = info.coords;
            
            const userID = firebase.auth().currentUser.uid;
            firebase.firestore().collection('teams').doc(teamID).collection('locations').doc(userID).set({
                latitude,
                longitude
            });
        });
    }

    return <Button title="Send My Location" onPress={sendLocation} />;
}

export default SendLocationButton;