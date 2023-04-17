import {useRoute, useNavigation} from '@react-navigation/native';
import { useEffect } from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PostCard from '../components/PostCard';
import events from '../lib/events';

function PostScreen(){
    const route = useRoute();
    const navigation = useNavigation();
    const {post} = route.params;
   

    useEffect(() => {
        console.log("post: ",post)
        const handler = ({description}) => {
            navigation.setParams({post: {...post, description}});
        };
        events.addListener('updatePost', handler);
        return () => {
            events.removeListener('updatePost', handler);
        };
    }, [post, navigation]);
    
    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <PostCard
                user={post.user}
                photoURL={post.photoURL}
                description={post.description}
                createAt={post.createAt}
                id={post.id}
                />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    block: {flex : 1},
    contentContainer: {
        paddingBottom: 40,
    },
});

export default PostScreen;