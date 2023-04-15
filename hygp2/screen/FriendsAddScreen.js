import { StyleSheet, View, Text, Pressable, Platform, 
  useWindowDimensions ,TextInput, Button, Keyboard } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserContext } from "../context/UserContext";
import {useNavigation} from '@react-navigation/native'
import { useState, useEffect, useRef } from "react";
import IconRightButton from "../components/IconRightButton";
import firestore from '@react-native-firebase/firestore'
import Avatar from "../components/Avatar";
import Toast from 'react-native-easy-toast';
import { friendIdSearch } from "../lib/friends";

function FriendsAddScreen(){
    const navigation = useNavigation();
    const [friend, setFriend] = useState();
    const [displayName, setDisplayName] = useState();
    const {width} = useWindowDimensions();
    const [user, setUser] = useState({});
    const [response, setResponse] = useState(false);
    let {data} = [];
    const [exist, setExist] = useState(false);
    const toastRef = useRef(); // toast ref 생성

    useEffect(() => {
      navigation.setOptions({  
          headerRight: () => (
              <IconRightButton
                  name="send"
                  onPress={onPress}
                  />                       
          ),
      });
  }, [displayName, exist])

    // 버튼클릭 : 친구 서치하고 프로필 보이게 해줌
    const onPress = () => {
      
      Keyboard.dismiss();
       firestore().collection('user').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
         
          if(displayName == doc.data().displayName){        
            console.log(doc.id, '=>', doc.data());   
            data = doc.data()
            setUser(data);
            setResponse(true);
            setExist(true);
           }

        });
      });
      if(!exist){
        toastRef.current.show("검색 결과가 없습니다.");
      }
      setExist(false);
    };

    const cancel = () => {
      this.textInputRef.clear();
      setDisplayName('');
    };

    const add = () => {
      friendIdSearch();
    };
  if(!response){
      return (
        <View>
          <View style={[styles.block, {width: width - 5}]}>
              <TextInput style={styles.input} 
                ref={ref => this.textInputRef = ref}
                placeholder="친구 닉네임" 
                autoFocus 
                onChangeText={setDisplayName}
              />
              <Pressable 
                  style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}
                  onPress={cancel}>
                  <Icon name="cancel" size={20} color="#9e9e9e" />
              </Pressable>
          </View>
          <Toast ref={toastRef}
                        positionValue={width * 0.55}
                        fadeInDuration={300}
                        fadeOutDuration={1000}
                        style={{backgroundColor:'rgba(33, 87, 243, 0.5)'}}
                    />
      </View>
      )
  }
  
  else{
    return(
      <View>
          <View style={[styles.block, {width: width - 5}]}>
                  <TextInput style={styles.input}
                    ref={ref => this.textInputRef = ref}
                    placeholder="친구 닉네임" 
                    autoFocus 
                    onChangeText={setDisplayName}
                  />
                  <Pressable 
                      style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}
                      onPress={cancel}>                        
                      <Icon name="cancel" size={20} color="#9e9e9e" 
                       />
                  </Pressable>
              </View>
        <View style={[styles.profile, {width: width - 5}]}>
          <Avatar source={user.photoURL && {uri: user.photoURL}} size={100} />
          <Text style={styles.name}>{user.displayName}</Text>
          <Button title="친구 추가" margin= {20} onPress={add} ></Button> 
        </View>
        <Toast ref={toastRef}
                        positionValue={width * 0.55}
                        fadeInDuration={300}
                        fadeOutDuration={1000}
                        style={{backgroundColor:'rgba(33, 87, 243, 0.5)'}}
                    />
     </View>
    )
  };

}

const styles = StyleSheet.create({
    block: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      input: {
        flex: 1,
      },
      button: {
        marginLeft: 8,
      },
      name: {
        fontSize: 30,
        textAlign: "center",
        margin: 20,
      },
      profile: {
        backgroundColor: 'white',
        marginTop: 30,
        alignItems: 'center',
        width: '100%',
      },
});

export default FriendsAddScreen;