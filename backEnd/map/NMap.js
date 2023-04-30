import { useEffect, useState, useContext } from 'react';
import NaverMapView, { Marker } from "react-native-nmap";
import Geolocation from '@react-native-community/geolocation';
import TeamContext from '../../hygp2/screen/Teams/TeamContext';
import SendLocationButton from './SendLocation';
const { teamId } = useContext(TeamContext);

const NMap = () => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(info => setPosition(info.coords));
    }, []);

    return (
        <>
            <NaverMapView style={{width: '100%', height: '100%'}} 
                center={{...position, zoom: 16}}
            >
                {position && <Marker coordinate={position} />}
            </NaverMapView>
            <SendLocationButton>
                
            </SendLocationButton>
        </>
    );
}

export default NMap;
