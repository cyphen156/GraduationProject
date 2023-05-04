import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet, View, Pressable, Platform,
    Image, ActivityIndicator, Button, Alert,
    Text, Dimensions, Keyboard
} from "react-native";
import { signIn, signOut } from "../lib/auth";
import { updateUser, nameCheck } from "../lib/user";
import BordredInput from "./BordredInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../context/UserContext";
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import events from "../lib/events";
import { updateProfile } from "../lib/posts";
import firestore from '@react-native-firebase/firestore'
import Toast from 'react-native-easy-toast';
import { SafeAreaView } from "react-native-safe-area-context";

function UpdateProfile() {
    const [displayName, setDisplayName] = useState('');
    const navigation = useNavigation();
    const { user, setUser } = useUserContext();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [discription, setDiscription] = useState('#');
    const windowHeight = Dimensions.get('window').height;
    const [interests, setInterests] = useState([]);

    // 아이디 변경 가능여부
    let changeable = true;

    // 아이디 확인 버튼 여부
    let checking = false;

    const toastRef = useRef(); // toast ref 생성

    // console.log("user1", user);
    myPhotoURL = user.photoURL;
    id = user.id;

    useEffect(() => {
        const userRef = firestore().collection('user').doc(user.id);

        userRef.get().then((doc) => {
            if (doc.exists) {
                setInterests(doc.data().interests || []);
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        setDisplayName(user.displayName);
    }, [setUser, navigation]);

    const postUpadte = ({ users }) => {

        updateUser({
            photoURL: users.photoURL,
            id: users.id,
            displayName: users.displayName,
        });

        events.emit('updateUser', {
            photoURL: users.photoURL,
            id: users.id,
            displayName: users.displayName,
        });

        console.log("user2 :", users);

        updateProfile({
            id: users.id,
            user: users,
        });
        events.emit('updateProfile', {
            id: users.id,
            user: users,
        });
    }

    const onSave = async () => {
        const userRef = firestore().collection('user').doc(user.id);

        userRef.get().then((doc) => {
            if (doc.exists) {
                let interests = doc.data().interests || [];

                if (!interests.includes(discription)) {
                    interests.push(discription);

                    userRef.update({ interests: interests }).then(() => {
                        setInterests(interests);  // 상태 업데이트
                        setDiscription('#');  // 입력란 초기화
                    });
                } else {
                    toastRef.current.show('이미 존재하는 관심사입니다.');
                }
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    };

    const onDelete = async (interestToDelete) => {
        const userRef = firestore().collection('user').doc(user.id);

        userRef.get().then((doc) => {
            if (doc.exists) {
                let interests = doc.data().interests || [];
                const updatedInterests = interests.filter(interest => interest !== interestToDelete);
                userRef.update({ interests: updatedInterests }).then(() => {
                    setInterests(updatedInterests);
                });
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    };

    const onSubmit = async () => {
        setLoading(true);
        Keyboard.dismiss();
        if (changeable && checking) {

            let photoURL = null;

            if (response) {
                const asset = response.assets[0];
                const extension = asset.fileName.split('.').pop(); // 확장자 추출
                const reference = storage().ref(` /profile/${user.id}.${extension}`); // 업로드할 경로

                if (Platform.OS === 'android') {
                    await reference.putString(asset.base64, 'base64', {
                        contentType: asset.type,
                    });
                } else {
                    await reference.putFile(asset.uri); // 파일 저장
                }
                // 다운로드할 수 있는 URL 생성
                photoURL = response ? await reference.getDownloadURL() : null;
            } else {
                photoURL = myPhotoURL;
                console.log("photoURL : ", photoURL);
            }

            users = {
                photoURL: photoURL,
                displayName: displayName,
                id: id,
            }

            console.log(users+'1');
            postUpadte({ users });

            setUser(users);

            navigation.pop();

            // posts에 참조된 user의 값을 변경해준다

            // await createTest({user, name});

            console.log("user3: ", user)
            onLogout();
            on
        } else {
            toastRef.current.show("닉네임을 확인 해주세요.");
        }
    };

    const onCancel = () => {
        toastRef.current.show("프로필 변경을 취소합니다.");
        setTimeout(() => {
            navigation.goBack();
        }, 1000);
    };

    const onSelectImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                maxWidth: 512,
                maxHeight: 512,
                includeBase64: Platform.OS === 'android',
            },
            (res) => {
                if (res.didCancel) {
                    // 취소했을 경우
                    return;
                }
                setResponse(res);
                console.log("image : ", res)
            },
        );
    };

    const onLogout = async () => {
        if (user) {
            await signOut();
            setUser(null);
        }
    };

    const check = () => {
        Keyboard.dismiss();
        if (displayName.length < 3) {
            toastRef.current.show('3자리 이상 입력하세요.');
            return

        }
        checking = true;

        firestore().collection('user').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log(doc.id, '=>', doc.data());

                // 다른 유저 displayName 이름 중복이 있으면 
                if (displayName == doc.data().displayName && doc.id != id) {
                    console.log('중복 O');
                    toastRef.current.show('닉네임이 중복됩니다.');
                    changeable = false;
                }
            });

        }).then(() => {
            console.log('changeable : ', changeable);
            if (changeable == true) {
                toastRef.current.show('닉네임 변경이 가능합니다.');
            }
        });

    };

    return (
        <SafeAreaView>
            <View style={styles.block}>
                <Pressable onPress={onSelectImage} >
                    <Image
                        //source={source || require('../assets/images/user.png')}
                        resizeMode="cover"
                        style={styles.circle}
                        source={
                            response
                                ? { uri: response?.assets[0]?.uri }
                                : { uri: user.photoURL }
                        }
                    />
                </Pressable>
                <View style={styles.form}>
                    <View style={styles.checking}>
                        <BordredInput
                            placeholder="닉네임"
                            value={displayName}
                            onChangeText={setDisplayName}
                            onSubmitEditing={onSubmit}
                            returnKeyType="next"
                            width="90%"
                            margin={10}
                        />
                        <Button style={styles.margin} title="닉네임 확인" onPress={check} />
                        <Toast ref={toastRef}
                            positionValue={windowHeight * 0.66}
                            fadeInDuration={300}
                            fadeOutDuration={1000}
                            style={{ backgroundColor: 'rgba(33, 87, 243, 0.5)' }}
                        />
                    </View>
                    <View style={styles.checking}>
                        <BordredInput
                            placeholder="관심사를 입력하세요"
                            value={discription}
                            onChangeText={setDiscription}
                            returnKeyType="next"
                            width="90%"
                            margin={10}
                        />
                        <Button style={styles.margin} title="관심사 추가" onPress={onSave} />
                    </View>
                    <View style={styles.interestsContainer}>
                        {interests.map((interest, index) => (
                            <Pressable key={index} onLongPress={() => onDelete(interest)}>
                                <Text style={styles.interest}>{interest}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <View style={styles.button}>
                        <CustomButton title="변경" onPress={onSubmit} hasMarginBottom />
                        <CustomButton title="취소" onPress={onCancel} theme="secondary" />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    block: {
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 16,
        width: '100%',
    },
    circle: {
        backgroundColor: '#cdcdcd',
        borderRadius: 64,
        width: 128,
        height: 128,
    },
    form: {
        marginTop: 8,
        width: '50%',
    },
    button: {
        marginTop: 108,
    },
    checking: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    margin: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    interest: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 4,
        marginVertical: 2,
        backgroundColor: '#f1f1f1',
        borderRadius: 4,
        maxWidth: '100%',
    },
});
UpdateProfile.defaultProps = {
    size: 32,
};

export default UpdateProfile;