import {View} from 'react-native';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import usePosts from '../hooks/usePosts';
import events from '../lib/events';
import { useUserContext } from '../context/UserContext';
import { friendIdSearch } from '../lib/friends';
import firebase from '@react-native-firebase/app';

function FileScreen(){
    const {user, setUser} = useUserContext();
    const {posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost} = usePosts();
    const [ isLoading, setIsLoading ] = useState(false);
    const [idDoc, setIddoc] = useState([]);
    const [friendArray, setFriendArray] = useState([]);


    useEffect(() => {
        // 친구 목록 가져오기
        friendIdSearch(user.id).then((array) => {
            setFriendArray(array);
            console.log("friendArray : ", friendArray);
        })
    
      }, [user, setFriendArray, posts]);

    useEffect(() => {
        //console.log("FileScreen", posts)
        events.addListener('refresh', onRefresh);
        events.addListener('removePost', removePost);
        return () => {
            events.removeListener('refresh', onRefresh);
            events.removeListener('removePost', removePost);
        };
    }, [onRefresh, removePost]);
    // keyExtractor : 각 항목 데이터 고유의 값을 설정해준다.
    return (
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.75}
            ListFooterComponent= {
                !noMorePost && (
                    <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
                )
            } 
            refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing}/>  
            }
        />          
    );
}

    const renderItem = ({item}) => {
    // 친구 id 가져오고, id에 맞는 게시물을 가져오기 해야함 


    return ( 
        <PostCard
            createdAt={item.createdAt}
            description={item.description}
            id={item.id}
            user={item.user}
            photoURL={item.photoURL}
        />
    )};

    const styles = StyleSheet.create({
        container: {
            paddingBottom: 48,
        },
        spinner: {
            height: 64,
        },
    });

export default FileScreen;