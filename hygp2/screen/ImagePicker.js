/*
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from "react-native-image-picker";

function CCCC () {
  const [imageUri, setImageUri] = useState(null);

  const launchCamera = () => {
    ImagePicker.launchCamera(
      {
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      (response) => {
        if (!response.didCancel && !response.error) {
          setImageUri(response.uri);
        }
      },
    );
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      ) : (
        <TouchableOpacity onPress={launchCamera}>
          <Text>Take a Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CCCC;
*/
import ImagePicker from 'react-native-image-picker';
import { Image, View, StyleSheet, TouchableOpacity} from 'react-native'
import { useState } from 'react';

const [ img, setImageSource ] = useState("");  // 이미지를 img변수에 할당시킬겁니다!

function pickImg() { 
  const options = {
    title: 'Select Avatar', //이미지 선택할 때 제목입니다 ( 타이틀 ) 
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }], // 선택 버튼을 커스텀 할 수 있습니다.
    storageOptions: {
      skipBackup: true,	// ios인 경우 icloud 저장 여부 입니다!
      path: 'images',
    },
  };

  /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info in the API Reference)
   */
  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      setImageSource(response.uri); // 저는 여기서 uri 값을 저장 시킵니다 !
    }
  })

  return (
    <View>
      <TouchableOpacity style={styles.imgWrapper} onPress={()=>pickImg()}>
        <Image source={{uri: img}} style={styles.imgStyle}/>
      </TouchableOpacity>  
      <TouchableOpacity style={styles.imgWrapper} onPress={()=>pickImg()}>
        <Image source={defaultImg} style={styles.imgStyle}/>
      </TouchableOpacity>
    </View>
  )
}

/* return 코드
{img ?   // 이미지가 있으면 라이브러리에서 받아온 이미지로 출력, 없으면 디폴트 이미지 출력!
	
}*/

export default  pickImg;