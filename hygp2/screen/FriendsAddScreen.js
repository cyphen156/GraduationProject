import { StyleSheet, View, Text, Pressable, Platform, useWindowDimensions ,TextInput, Button } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserContext } from "../context/UserContext";
import {useNavigation} from '@react-navigation/native'
import { useState, useEffect } from "react";
import IconRightButton from "../components/IconRightButton";
import firestore from '@react-native-firebase/firestore'
import Avatar from "../components/Avatar";

function FriendsAddScreen(){
    const navigation = useNavigation();
    const [friend, setFriend] = useState();
    const [displayName, setDisplayName] = useState();
    const {width} = useWindowDimensions();
    const [user, setUser] = useState({});
    const [response, setResponse] = useState(false);
    let {data} = [];

    useEffect(() => {
      navigation.setOptions({  
          headerRight: () => (
              <IconRightButton
                  name="send"
                  onPress={onPress}
                  />                       
          ),
      });
  }, [displayName])

    // 버튼클릭 : 친구 서치하고 프로필 보이게 해줌
    const onPress = () => {
       firestore().collection('user').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
         
          if(displayName == doc.data().displayName){  
            console.log(doc.id, '=>', doc.data());   
            data = doc.data()
            setUser(data);
            setResponse(true);
            
          }else{
            
          }
        });
      });
      
    };

  if(!response ){

      return (
        <View>
          <View style={[styles.block, {width: width - 5}]}>
              <TextInput style={styles.input} placeholder="친구 닉네임" autoFocus 
                onChangeText={setDisplayName}
              />
              <Pressable
                  style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}>
                  <Icon name="cancel" size={20} color="#9e9e9e" />
              </Pressable>
          </View>
          <Text style={styles.name}>{friend}</Text>
      </View>
      )
  }
  else{

    return(
      <View>
          <View style={[styles.block, {width: width - 5}]}>
                  <TextInput style={styles.input} placeholder="친구 닉네임" autoFocus 
                    onChangeText={setDisplayName}
                  />
                  <Pressable
                      style={({pressed}) => [styles.button, pressed && {opacity: 0.5}]}>
                      <Icon name="cancel" size={20} color="#9e9e9e" />
                  </Pressable>
              </View>

        <View style={[styles.profile, {width: width - 5}]}>
          <Avatar source={user.photoURL && {uri: user.photoURL}} size={100} />
          <Text style={styles.name}>{user.displayName}</Text>
          <Button title="친구 추가" margin= {20}  ></Button> 
        </View>

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