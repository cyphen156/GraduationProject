import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Pressable, Text } from "react-native";
import TransparentCircleButton from "./TransparentCircleButton";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useReducer } from "react";

const initialState = {mode: 'date', visible: false};
    function reducer(state, action) {
        switch (action.type){
            case 'open':
                return {mode: action.mode,
                visible: true,};
            case 'close':
                return {
                    ...state,
                    visible: false,
                };
            default:
                throw new Error("Unhandled action type");
        }
    }

function WriteTeamTodos({date, onChangeDate}) {

    const navigation = useNavigation();
    const onGoBack = () => {
        navigation.pop();
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const open = mode => dispatch({type: 'open', mode});
    const close = () => dispatch({type: 'close'});

    const onConfirm = selectedDate => {
        close();
        onChangeDate(selectedDate);
    };

    return (
        <View style={styles.block}>
                
            <View style={styles.center}>
                <Pressable onPress={() => open('date')}>
                <Text>
                    {format(new Date(date), 'PPP', {
                    locale: ko,
                    })}
                </Text>
                </Pressable>
                <View style={styles.separator} />
                <Pressable onPress={() => open('time')}>
                <Text>{format(new Date(date), 'p', {locale: ko})}</Text>
                </Pressable>
            </View>
            <DateTimePickerModal
                isVisible={state.visible}
                mode={state.mode}
                onConfirm={onConfirm}
                onCancel={close}
                date={date}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        height: 40,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttons:{
        flexDirection: "row",
        alignItems:"center",
    },
    center: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        flexDirection: 'row',
      },
      separator: {
        width: 8,
      },
});

export default WriteTeamTodos;