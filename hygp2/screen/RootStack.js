import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WriteScreen from './Write';
import SignIn from "./SignIn";
import WelcomeScreen from "./WelcomeScreen";
import HomeScreen from "./Home";
import { useUserContext } from "../context/UserContext";
import MainTab from "./MainTab";
import FileScreen from "./FileScreen";
import {subscribeAuth} from '../lib/auth';
import {getUser} from '../lib/user';
import { useEffect, useState } from "react";
import UploadScreen from "./UploadScreen";
import MyProfileScreen from "./MyProfileScreen";
import SettingScreen from "./SettingScreen";
import PostScreen from './PostScreen';
import ModifyScreen from "./ModifyScreen";
import UserProfileScreen from "./UserProfileScreen"; 
import UpdateProfile from "../components/UpdateProfile";
import FriendsAddScreen from "./FriendsAddScreen";
import FriendsList from "./FriendsList";
import SubTab from "./SubTab";
import TeamContext from "./Teams/TeamContext";

const Stack = createNativeStackNavigator();

function RootStack() {
    
    const {user, setUser} = useUserContext();
    const [teamId, setTeamId] = useState(null);

    useEffect(() => {
        // 컴포넌트 첫 로딩 시 로그인 상태를 확인하고 UserContext에 적용
        const unsubscribe = subscribeAuth(async currentUser => {
          // 여기에 등록한 함수는 사용자 정보가 바뀔 때마다 호출되는데
          // 처음 호출될 때 바로 unsubscribe해 한 번 호출된 후에는 더 이상 호출되지 않게 설정
          unsubscribe();
          if (!currentUser) {
            //SplashScreen.hide();
            return;
          }
          const profile = await getUser(currentUser.uid);
          if (!profile) {
            return;
          }
          setUser(profile);
        });
      }, [setUser]);

    return (
      <TeamContext.Provider value = {{teamId, setTeamId}}>
        <Stack.Navigator>     
            {user ? (
                <>
                    <Stack.Screen name="MainTab" component={MainTab} options={{headerShown: false}} />
                    <Stack.Screen name="SubTab" component={SubTab} options={{headerShown: false}} />
                    <Stack.Screen name="Write" component={WriteScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="MyProflie" component={MyProfileScreen}/>
                    <Stack.Screen name="UserProfile" component={UserProfileScreen}  />
                    <Stack.Screen name="프로필 변경" component={UpdateProfile} />
                    <Stack.Screen 
                      name="Upload"
                      component={UploadScreen}
                      options={{title: '새 게시물', headerBackTitle: '뒤로가기'}}                    
                     />
                     <Stack.Screen 
                      name="Setting"
                      component={SettingScreen}
                      options={{title: '설정', headerBackTitle: '뒤로가기'}}                    
                     />
                     <Stack.Screen 
                      name="FriendsAdd"
                      component={FriendsAddScreen}
                      options={{title: '닉네임으로 친구 추가 ', headerBackTitle: '뒤로가기'}}                    
                     />
                     <Stack.Screen 
                      name="FriendsList"
                      component={FriendsList}
                      options={{title: '친구 목록', headerBackTitle: '뒤로가기'}}                    
                     />
                     <Stack.Screen
                      name='Post'
                      component={PostScreen}
                      options={{title: '게시물'}}
                      />
                      <Stack.Screen
                      name='Modify'
                      component={ModifyScreen}
                      options={{title: '설명 수정', headerBackTitle: '뒤로가기'}}
                      />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
                    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}} />
                </>
            )}       
        </Stack.Navigator>
      </TeamContext.Provider>
    );
}

export default RootStack;