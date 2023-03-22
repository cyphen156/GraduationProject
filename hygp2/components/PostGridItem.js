import { StyleSheet, useWindowDimensions, Image, Pressable } from 'react-native';
import { makeMutable } from 'react-native-reanimated';

function PostGridItem({post}){
    const dimensions = useWindowDimensions();
    const size = dimensions.width / 3;

    const onPress = () => {
        // TODO: 단일 포스트 조회 화면 띄우기
    }
}

const styles = StyleSheet.create({
    block: {},
    image: {
        backgroundColor: '#bdbdbd',
        width: '100%',
        height: '100%',
    },
});

export default PostGridItem;