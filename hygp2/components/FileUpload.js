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
import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import firestore from '@react-native-firebase/firestore';

function FileUpload({teamId, onClick}) {

const [singleFile, setSingleFile] = useState(null);
const [blob, setBlob] = useState(null);
const [metadata, setMetadata] = useState(null);
const {user} = useUserContext();
const navigation = useNavigation();
const teamsId = teamId;

 const uploadImage = useCallback(async () => {

    // 권한 요청
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log('Permission denied');
      return;
    }
     
    if (singleFile != null) {
      // If file selected then create FormData
      const fileToUpload = singleFile;
      // navigation.pop();
      if (!fileToUpload[0].uri) {
        console.error('DocumentPicker Error: URI not found');
        return;
      }

      // 파일을 Blob 형태로 변환
      const {uri} = fileToUpload[0];
      const path = uri.startsWith('file://') ? uri.slice(7) : uri; // file:// 접두사 제거
      const base64 = await RNFetchBlob.fs.readFile(path, 'base64');
      const metadata = {
        contentType: fileToUpload[0].type,
      };
      console.log("fileToUpload : ", fileToUpload)
      // Firebase Storage에 업로드
      const extension = fileToUpload[0].name.split('.').pop(); // 확장자
      let fileName = v4();
      const reference = storage().ref(` /file/${user.id}/${fileName}.${extension}`);
      fileName = `${fileName}.${extension}`
      console.log(`파일 업로드 : ${extension}, ${reference}` );
      if (Platform.OS === 'android'){
        const task = reference.putString(base64, 'base64', metadata);
        task.on('state_changed', taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });
        await task;
      } 
      else {
        await reference.putFile(fileToUpload[0].uri);
      }
      const photoURL = await reference.getDownloadURL().then(url => {
        // file컬렉션 만들기
        firestore().collection(`teams`).doc(teamsId).collection("files").add({
          id : user.id,
          createdAt: firestore.FieldValue.serverTimestamp(),
          photoURL : url,
          fileName : fileName,
            })
          //Chat.js로 데이터 옮기기
          onClick(url, fileName, user);
          return url;
        } 
      );
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


const downloadFile = async (photoURL, fileName) => {
  const dirs = RNFetchBlob.fs.dirs;
  const localPath = `${dirs.DownloadDir}/${fileName}`;
  
  try {
    const response = await RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
      path: localPath,
    }).fetch('GET', photoURL);

    console.log('File downloaded to:', response.path());
  } catch (err) {
    console.error('Download failed:', err);
  }
};

// 파일 다운로드 실행
// downloadFile(photoURL, result.name);
  //권한 부여
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload files.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // fileName, url을 Chat.js로 보내야 함.
  // const handleClick = () => {
  //   let data = 1 ;
  //   data += 1;
  //   onClick(data);
  //   console.log(data)
  // };

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
          {/* URI: {singleFile[0].uri ? singleFile[0].uri : ''}
          {'\n'} */}
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
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={downloadFile}
        >
           <Text style={styles.buttonTextStyle}>다운로드</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    mainBody: {
      flex: 0.7,
      justifyContent: 'center',
  
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