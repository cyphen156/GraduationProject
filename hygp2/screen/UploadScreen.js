import {useRoute, useNavigation} from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {StyleSheet, View, TextInput, Image, Keyboard, 
  Animated, useWindowDimensions, Platform, KeyboardAvoidingView} from 'react-native';
import IconRightButton from '../components/IconRightButton';
import storage from '@react-native-firebase/storage';
import {useUserContext} from '../context/UserContext';
import {v4} from 'uuid';
import {createPost} from '../lib/posts';
import { createData } from '../nullable/DBsync';
import events from '../lib/events';

function UploadScreen(){
    const route = useRoute();
    const {res} = route.params || {};
    const {width} = useWindowDimensions();
    const animation = useRef(new Animated.Value(width)).current;
    const [isKeyboardOpen, setIsKeyboardOpen] = useState();
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const {user} = useUserContext();

    const onSubmit = useCallback(async () => {
      // 포스트 작성 로직 구현
      console.log('res : ', res);
      navigation.pop();
      const asset = res.assets[0];
      const extension = asset.fileName.split('.').pop();
      const reference = storage().ref(` /photo/${user.id}/${v4()}.${extension}`);
      console.log(`포스트 업로드 : ${extension}, ${reference}` );
        if (Platform.OS === 'android'){
          await reference.putString(asset.base64, 'base64', {
            contentType: asset.type,
          });
        } else {
          await reference.putFile(asset.uri);
        }

        const photoURL = await reference.getDownloadURL();
        await createPost({description, photoURL, user});
        await createData({test, description, photoURL, user});
        events.emit('refresh');
        // TODO: 포스트 목록 새로고침
    }, [res, user, description, navigation]);

    useEffect(() => {
      const didShow = Keyboard.addListener('keyboardDidShow', () =>
        setIsKeyboardOpen(true),
      );
      const didHide = Keyboard.addListener('keyboardDidHide', () =>
        setIsKeyboardOpen(false),
      );
  
      return () => {
        didShow.remove();
        didHide.remove();
      };
      // 업로드된 파일 저장

    }, []);
  
    useEffect(() => {
      Animated.timing(animation, {
        toValue: isKeyboardOpen ? 0 : width,
        useNativeDriver: false,
        duration: 150,
        delay: 100,
      }).start();
    }, [isKeyboardOpen, width, animation]);
    
    useEffect(() => {
      navigation.setOptions({
        headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
      });
    }, [navigation, onSubmit]);

    return (
      <KeyboardAvoidingView
      behavior={Platform.select({ios: 'height'})}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 180,
      })}>
      <Animated.Image
        source={{uri: res?.assets?.[0]?.uri}}
        style={[styles.image, {height: animation}]}
        resizeMode="cover"
      />
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="이 사진에 대한 설명을 입력하세요..."
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
      
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    block: {
      flex: 1,
    },
    image: {width: '100%'},
    input: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
      flex: 1,
      fontSize: 16,
    },
  });

export default UploadScreen;