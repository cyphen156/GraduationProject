import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import FeedList from "../components/FeedList";
import LogContext from "../context/LogContext";
import SearchContext from "../context/SearchContext";
import EmptySearchResult from "../components/EmptySearchResult";
import { useEffect } from 'react';
import IconRightButton from "../components/IconRightButton";
import IconLeftButton from "../components/IconLeftButton";


function SearchScreen({navigation}){

    useEffect(() => {
        navigation.setOptions({
            title: 'Search', headerTitleAlign: 'center',
            headerLeft: () => (
                <>
                <IconLeftButton
                    name="Profile"
                    onPress={() => navigation.navigate('Profile')
                  }
                    />
                    </>),
            headerRight: () => (
              <View style={{flexDirection: 'row'}}>
                <IconRightButton
                    name="search"
                    onPress={() => navigation.navigate('FriendsList')}
                    />
                <IconRightButton
                    name="person-add"
                    onPress={() => navigation.navigate('FriendsAdd')}
                    />
                <IconRightButton
                    name="settings"
                    onPress={() => navigation.navigate('Setting')}
                    />      
                 </View>   
            ),
        });
        },[navigation])

    const {keyword} = useContext(SearchContext);
    const {logs} = useContext(LogContext);

    const filtered =
        keyword === ''
        ? []
        : logs.filter((log) =>
            [log.title, log.body].some((text) => text.includes(keyword)),
            );
        
    if (keyword === '') {
        return <EmptySearchResult type="EMPTY_KEYWORD"/>
    }
    if (filtered.length === 0) {
        return <EmptySearchResult type="NOT_FOUND"/>
    }

    return (
        <View style = {styles.block}>
            <FeedList logs={filtered} />
        </View>
    );
}

const styles = StyleSheet.create({
    block: { flex: 1, },
});

export default SearchScreen;