import { format } from "date-fns";
import { useContext, useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import CalendarView from "../components/CalendarView";
import FeedList from "../components/FeedList"
import LogContext from "../context/LogContext";

function CalendarScreen() {
    const {logs} = useContext(LogContext);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), 'yyyy-mm-dd'),);
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
        (log) => format(new Date(log.date), 'yyyy-mm-dd') === selectedDate,);
    return (
        <FeedList
            logs={filteredLogs}
            ListHeaderComponent = {
                <CalendarView 
                    markedDates={markedDates} 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate}>
                </CalendarView>
            }
        />
    );
}

const styles = StyleSheet.create({
    block: {},
});

export default CalendarScreen;