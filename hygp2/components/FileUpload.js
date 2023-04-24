import {useRoute, useNavigation} from '@react-navigation/native';
import React, { useState , useCallback } from 'react';
// Import core components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import { createFile } from '../lib/files';
import {useUserContext} from '../context/UserContext';
import {v4} from 'uuid';

function FileUpload() {

const [singleFile, setSingleFile] = useState(null);
const {user} = useUserContext();
const navigation = useNavigation();

 const uploadImage = useCallback(async () => {
    // Check if any file is selected or not
    if (singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      //navigation.pop();

      const extension = fileToUpload[0].name.split('.').pop(); // 확장자
      const reference = storage().ref(` /file/${user.id}/${v4()}.${extension}`);
      console.log(`파일 업로드 : ${extension}, ${reference}` );
      const message2 = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';

      if (Platform.OS === 'android'){
          await reference.putString(message2, 'base64', {
            contentType: fileToUpload[0].type,
          });
        } else {
          await reference.putFile(fileToUpload[0].uri);
        }
        const photoURL = await reference.getDownloadURL();
        await createFile({user, fileToUpload , photoURL});
      }
  }, [singleFile, user, navigation]);
// file:///data/user/0/com.hygp2/cache/rn_image_picker_lib_temp_17a66d7d-f21d-4900-9b1a-66b6275d14ab.jpg
  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
return (
    <View style={styles.mainBody}>
      <View style={{ alignItems: 'center' }}>
      </View>
      {/*Showing the data of selected Single file*/}
      {singleFile != null ? (
        <Text style={styles.textStyle}>
          File Name: {singleFile[0].name ? singleFile[0].name : ''}
          {'\n'}
          Type: {singleFile[0].type ? singleFile[0].type : ''}
          {'\n'}
          File Size: {singleFile[0].size ? singleFile[0].size : ''}
          {'\n'}
          URI: {singleFile[0].uri ? singleFile[0].uri : ''}
          {'\n'}
        </Text>
      ) : null}
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={selectFile}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={uploadImage}>
        <Text style={styles.buttonTextStyle}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    mainBody: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    buttonStyle: {
      backgroundColor: '#307ecc',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#307ecc',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 15,
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
    textStyle: {
      backgroundColor: '#fff',
      fontSize: 15,
      marginTop: 16,
      marginLeft: 35,
      marginRight: 35,
      textAlign: 'center',
    },
  });

export default FileUpload;