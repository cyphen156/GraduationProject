import { View, Button } from 'react-native';

function HomeScreen ({navigation}) {
    return (
        <View>
            <Button 
                title="Detail Open" 
                onPress={() => navigation.navigate('Detail')}
            />
        </View>
    );
}

export default HomeScreen;