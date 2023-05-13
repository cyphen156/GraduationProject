import { useEffect, useState, useCallback } from "react";
import { getNewerPosts, getOlderPosts, getPosts, PAGE_SIZE } from "../lib/posts";
import {useUserContext} from '../context/UserContext';
import usePostsEventEffect from './usePostsEventEffect';
import { friendIdSearch } from '../lib/friends';

export default function usePosts(userId){
    const [posts, setPosts] = useState(null);
    const [noMorePost, setNoMorePost] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [friendArray, setFriendArray] = useState([]);
    const {user} = useUserContext();
    const [ refresh, setRefresh ] = useState(false);

    const onLoadMore = async () => {
        if(noMorePost || !posts || posts.length < PAGE_SIZE){
            return;
        }
        const lastPost = posts[posts.length - 1];
        const olderPosts = await getOlderPosts(lastPost.id, userId);
        
        if (olderPosts.length < PAGE_SIZE){
            setNoMorePost(true);
        }
        setPosts(posts.concat(olderPosts));
    };

    const onRefresh = useCallback(async () => {
        if(!posts || posts.length === 0 || refreshing){
            return;
        }
        const firstPost = posts[0];
        setRefreshing(true);
        const newerPosts = await getNewerPosts(firstPost.id, userId);
        setRefreshing(false);
        if (newerPosts.length === 0){
            return;
        }
        setPosts(newerPosts.concat(posts));
    }, [posts, userId, refreshing]);

    useEffect(() => {
        getPosts({userId}).then((_posts) => {
            setPosts(_posts);
            if(_posts.length <= PAGE_SIZE){
                setNoMorePost(true);
            }
        });
    }, [userId]);

    const removePost = useCallback(
        (postId) => {
            setPosts(posts.filter((post) => post.id !== postId));
        },
        [posts],
    );
    
    const updatePost = useCallback(
        ({postId, description}) => {
            const nextPosts = posts.map((post) =>
                post.id === postId
                ? {
                    ...post,
                    description,
                }
                : post,
            );
            setPosts(nextPosts);
        },[posts],
    );

    usePostsEventEffect({
        refresh: onRefresh,
        removePost,
        enabled: !userId || userId === user.id,
        updatePost
    });

    // 추가된 코드
    const onRefreshWithFriends = useCallback(async () => {
        setRefresh(true);
        await fetchAndUpdateFriends();
        onRefresh();
    }, [fetchAndUpdateFriends, onRefresh]);

    async function fetchAndUpdateFriends() {
        const friends = await friendIdSearch(user.id);
        setFriendArray(friends.id);
    }
    // 추가된 코드 끝

    return {
        posts,
        noMorePost,
        refreshing,
        onLoadMore,
        onRefresh,
        removePost,
        onRefreshWithFriends, // 추가된 함수를 반환하여 외부에서 사용할 수 있도록 합니다.
    };
}
