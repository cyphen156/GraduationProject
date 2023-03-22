import { useMemo } from "react";
import {View, StyleSheet, Text ,Image, Pressable} from 'react-native';
import Avatar from "./Avatar";
import {useNavigation} from '@react-navigation/native';

function PostCard({user, photoURL, description, createAt, id}){
    const date = useMemo(
        () => (createAt ? new Date(createAt._seconds * 1000) : new Date()),
         [createAt],
    );
    const navigation = useNavigation();

    const onOpenProfile = () => {
        // TODO: 사용자 프로필 화면 열기
       navigation.navigate('Profile', {
          userId: user.id,
          displayName: user.displayName,
       })
    };

    return (
        <View style={styles.block}>
            <View style={[styles.head, styles.paddingBlock]}>
                <Pressable style={styles.profile} onPress={onOpenProfile}>
                    <Avatar source={user.photoURL && {uri: user.photoURL}} />
                    <Text style={styles.displayName}>{user.displayName}</Text>
                </Pressable>
            </View>
            <Image
                source={{uri: photoURL}}
                style={styles.image}
                resizeMethod="resize"
                resizeMode="cover"
            />
            <View style={styles.paddingBlock}>
                <Text style={styles.description}>{description}</Text>
                <Text date={date} style={styles.date}>{date.toLocaleDateString()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    block: {
      paddingTop: 16,
      paddingBottom: 16,
    },
  
    paddingBlock: {
      paddingHorizontal: 16,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    profile: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    displayName: {
      lineHeight: 16,
      fontSize: 16,
      marginLeft: 8,
      fontWeight: 'bold',
    },
    image: {
      backgroundColor: '#bdbdbd',
      width: '100%',
      aspectRatio: 1,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 8,
    },
    date: {
      color: '#757575',
      fontSize: 12,
      lineHeight: 18,
    },
  });
  
  export default PostCard;