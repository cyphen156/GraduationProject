import { NativeModules } from "react-native";

const {ToastButton} = NativeModules;

ToastButton.show('Hello World', ToastButton.LONG);

export default ToastButton;