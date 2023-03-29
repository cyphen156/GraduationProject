import {View} from 'react-native';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import usePosts from '../hooks/usePosts';
import events from '../lib/events';

function FileScreen(){
    const {posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost} = usePosts();

    useEffect(() => {
        //console.log("FileScreen", posts)
        events.addListener('refresh', onRefresh);
        events.addListener('removePost', removePost);
        return () => {
            events.removeListener('refresh', onRefresh);
            events.removeListener('removePost', removePost);
        };
    }, [onRefresh, removePost]);

    return (
        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.container}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.75}
            ListFooterComponent={
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

    const renderItem = ({item}) => (
        <PostCard
            createAt={item.createAt}
            description={item.description}
            id={item.id}
            user={item.user}
            photoURL={item.photoURL}
            />
    );

    const styles = StyleSheet.create({
        container: {
            paddingBottom: 48,
        },
        spinner: {
            height: 64,
        },
    });

export default FileScreen;