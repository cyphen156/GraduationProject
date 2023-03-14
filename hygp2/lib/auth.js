import auth from '@react-native-firebase/auth';

/** 로그인을 하는 함수 */
export function signIn({email, password}){
    return auth().signInWithEmailAndPassword(email, password);
}

/** 회원가입을 하는 함수 */
export function signUp({email, password}){
    return auth().createUserWithEmailAndPassword(email, password);
}

/** 앱을 가동할 때 또는 로그인 상태가 변경될 때 
 *  현재 사용자의 정보를 파라미터로 받아오는 
 * 특정 콜백 함수를 등록하는 함수
 */
export function subscribeAuth({callback}){
    return auth().onAuthStateChanged(callback);
}

/** 로그아웃을 하는 함수 */
export function signOut(){
    return auth().signOut();
}
