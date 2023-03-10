import { useState } from 'react';
import {View, Pressable, StyleSheet, Platform, ActionSheetIOS,} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UploadModeModal from './UploadModeModal';

const TABBAR_HEIGHT = 49;

function CameraButton(){
    const insets = useSafeAreaInsets();
    const [modalVisible, setModalVisible] = useState(false);

    const bottom = Platform.select({
        android: TABBAR_HEIGHT / 2, 
        ios: TABBAR_HEIGHT / 2 + insets.bottom - 4,
    });

    const onPress = () => {
        if(Platform.OS === 'android'){
            setModalVisible(true);
            return;
        }  

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['카메라로 촬영하기', '사진 선택하기','취소'],
                cancelButtonIndex: 2,
            },
            (buttonIndex) => {
                if (buttonIndex === 0){
                    console.log('카메라 촬영');
                }else if (buttonIndex === 1){
                    console.log('사진 선택');
                }
            },
        );
    };
    
    return (
        <>
        <View style={[styles.wraaper, {bottom}]}>
            <Pressable
                android_ripple={{
                    color: '#ffffff',
                }}
                style={styles.circle}
                onPress={onPress}>
                    <Icon name="camera-alt" color="white" size={24} />
            </Pressable>
        </View>
        <UploadModeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    wraaper: {
        zIndex: 5,
        borderRadius: 27,
        height: 54,
        width: 54,
        position: 'absolute',
        left: '50%',
        transform: [
            {
                translateX: -27,
            },
        ],
        ...Platform.select({
            ios: {
                shadowColor: '#4d4d4d',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 4,
        },
            android: {
                elevation: 5,
                overflow: 'hidden',
            },
        }),
    },
    circle: {
        backgroundColor: '#6200ee',
        borderRadius: 27,
        width: 54,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CameraButton;