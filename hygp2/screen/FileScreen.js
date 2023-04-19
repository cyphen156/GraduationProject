import { View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import PostCard from '../components/PostCard';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import usePosts from '../hooks/usePosts';
import events from '../lib/events';
import { useUserContext } from '../context/UserContext';
import { friendIdSearch } from '../lib/friends';
import firebase from '@react-native-firebase/app';
import { useIsFocused } from '@react-navigation/native';

// 게시물 화면
function FileScreen() {
  const { user, setUser } = useUserContext();
  const { posts, noMorePost, refreshing, onLoadMore, onRefresh, removePost, onRefreshWithFriends } = usePosts();
  const [isLoading, setIsLoading] = useState(false);
  const [idDoc, setIddoc] = useState([]);
  const [friendArray, setFriendArray] = useState([]);
  const isFocused = useIsFocused();

  const fetchAndUpdateFriends = useCallback(async () => {
    try {
      const friends = await friendIdSearch(user.id);
      setFriendArray(friends.id);
      setIsLoading(true);
    } catch (error) {
      console.error('Error fetching and updating friends:', error);
    }
  }, [user]);

  useEffect(() => {
    if (isFocused) {
      fetchAndUpdateFriends();
      onRefreshWithFriends();
    }
  }, [isFocused, fetchAndUpdateFriends]);

  useEffect(() => {
    events.addListener('refresh', onRefresh);
    events.addListener('removePost', removePost);
    return () => {
      events.removeListener('refresh', onRefresh);
      events.removeListener('removePost', removePost);
    };
  }, [onRefresh, removePost]);

  const renderItem = ({ item }) => {
    const idArray = friendArray;

    for (const id of idArray) {
      if (id === item.user.id) {
        return (
          <PostCard
            createdAt={item.createdAt}
            description={item.description}
            id={item.id}
            user={item.user}
            photoURL={item.photoURL}
          />
        );
      }
    }
  };

  if (isLoading) {
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
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default FileScreen;
