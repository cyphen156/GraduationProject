import { useEffect, useState, useCallback } from "react";
import { getNewerPosts, getOlderPosts, getPosts, PAGE_SIZE } from "../lib/posts";
import {useUserContext} from '../context/UserContext';
import usePostsEventEffect from './usePostsEventEffect';
import { friendIdSearch } from '../lib/friends';

export default function usePosts(userId){
    const [posts, setPosts] = useState(null); //게시물
    const [noMorePost, setNoMorePost] = useState(false);// 더 이상 불러올 게시물이 없음을 나타내는 상태
    const [refreshing, setRefreshing] = useState(false); //새로고침 중인지를 나타내는 상태
    const [friendArray, setFriendArray] = useState([]); //친구 ID 배열
    const {user} = useUserContext(); // 훅을 사용하여 현재 사용자 가져옴
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

    usePostsEventEffect({ // 게시물 이벤트를 처리 : 새로고침, 삭제, 업데이트 함수를 전달받는다.
        refresh: onRefresh,
        removePost,
        enabled: !userId || userId === user.id,
        updatePost
    });

    // 친구 목록을 업데이트한 후에 게시물 목록을 새로고침
    const onRefreshWithFriends = useCallback(async () => {
        setRefresh(true);
        await fetchAndUpdateFriends();
        onRefresh();
    }, [fetchAndUpdateFriends, onRefresh]);

    // 파이어베이스에서 친구 ID 배열값들을 가져오는 함수
    async function fetchAndUpdateFriends() {
        const friends = await friendIdSearch(user.id);
        setFriendArray(friends.id);
    }

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
