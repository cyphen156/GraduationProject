import { NativeModules } from "react-native";

const {ToastButton} = NativeModules;

ToastButton.show('환영합니다', ToastButton.LONG);

export default ToastButton;