import { format } from 'date-fns';
import { useContext, useState, useMemo, useEffect } from 'react';
import CalendarView from '../components/CalendarView';
import FeedList from '../components/FeedList';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { Pressable, StyleSheet, View } from 'react-native';
import Avatar from '../components/Avatar';
import { useUserContext } from '../context/UserContext';
import IconRightButton from '../components/IconRightButton';

const firestore = firebase.firestore();
const auth = firebase.auth();

function CalendarScreen({navigation}) {

  const [feeds, setFeeds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const {user} = useUserContext();

  useEffect(() => {
    navigation.setOptions({
        headerTitleAlign: 'center',
        headerLeft: () => (
            <>               
            <Pressable style={styles.profile}  onPress={() => navigation.push('Profile')}>
                <Avatar source={user.photoURL && {uri: user.photoURL}} size={38} />
            </Pressable>
                </>),
        headerRight: () => (
          <View style={styles.settings}>
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
    },[navigation, feeds])

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const teamName = 'your_team_name';
    const uid = 'your_uid';
    const todosRef = firestore.collection(`teams.${teamName}.todos.${uid}`);

    const querySnapshot = await todosRef.get();

    const todos = [];
    querySnapshot.forEach((doc) => {
      todos.push(doc.data());
    });

    setFeeds(todos);
  };

  const markedDates = useMemo(
    () =>
      feeds.reduce((acc, current) => {
        const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
        acc[formattedDate] = { marked: true };
        return acc;
      }, {}),
    [feeds],
  );

  const filteredLogs = feeds.filter((feed) => format(new Date(feed.date), 'yyyy-MM-dd') === selectedDate);

  return (
    <FeedList
      feeds={filteredLogs}
      ListHeaderComponent={
        <CalendarView markedDates={markedDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      }
    />
  );
}

const styles = StyleSheet.create({
  profile: {
      marginLeft: 16,
  },
  settings : {
    marginRight: 16,
    flexDirection: 'row',
  }
});

export default CalendarScreen;