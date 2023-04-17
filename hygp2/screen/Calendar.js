import { format } from 'date-fns';
import { useContext, useState, useMemo, useEffect } from 'react';
import CalendarView from '../components/CalendarView';
import FeedList from '../components/FeedList';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firestore = firebase.firestore();
const auth = firebase.auth();

function CalendarScreen() {
  const [feeds, setFeeds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

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

export default CalendarScreen;