import { format } from "date-fns";
import { useContext, useState, useMemo } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import CalendarView from "../components/CalendarView";
import FeedList from "../components/FeedList"
import LogContext from "../context/LogContext";
function Agendascr() {
    const {logs} = useContext(LogContext);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), 'yyyy-MM-dd'),);
    const markedDates = useMemo(
        () =>
          logs.reduce((acc, current) => {
            const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
            acc[formattedDate] = {marked: true};
            return acc;
          }, {}),
        [logs],
      );
        
    const filteredLogs = logs.filter(
        log => format(new Date(log.date), 'yyyy-MM-dd') === selectedDate,);

    const loadItems = (day) => {
        setTimeout(() => {
        const newItems = {};
        const date = day.dateString;

        newItems[date] = [
            {
            name: 'Item 1 - any js object',
            height: Math.max(50, Math.floor(Math.random() * 150))
            },
            {
            name: 'Item 2 - any js object',
            height: Math.max(50, Math.floor(Math.random() * 150))
            }
        ];

        setItems({ ...newItems });
        }, 1000);
    };

    const renderItem = (item) => {
        return (
        <View style={[styles.item, { height: item.height }]}>
            <Text>{item.name}</Text>
        </View>
        );
    };

    const renderEmptyDate = () => {
        return (
        <View style={styles.emptyDate}>
            <Text>This is an empty date!</Text>
        </View>
        );
    };

    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    };

    return (
        <>
            <FeedList
            logs={filteredLogs}
            ListHeaderComponent = {
                <CalendarView 
                    markedDates={markedDates} 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate} />
            }
            />
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                rowHasChanged={rowHasChanged}
            />
        </>
        
    );
}

export default Agendascr;