import { format } from "date-fns";
import { useContext, useState, useMemo } from "react";
import CalendarView from "../components/CalendarView";
import FeedList from "../components/FeedList"
import LogContext from "../context/LogContext";

function CalendarScreen() {
    const {feeds} = useContext(LogContext);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), 'yyyy-MM-dd'),);
    const markedDates = useMemo(
        () =>
        feeds.reduce((acc, current) => {
            const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
            acc[formattedDate] = {marked: true};
            return acc;
          }, {}),
        [feeds],
      );
        
    const filteredLogs = feeds.filter(
        feed => format(new Date(feed.date), 'yyyy-MM-dd') === selectedDate,);
    return (
        <FeedList
        feeds={filteredLogs}
            ListHeaderComponent = {
                <CalendarView 
                    markedDates={markedDates} 
                    selectedDate={selectedDate} 
                    onSelectDate={setSelectedDate} />
            }
        />
    );
}

export default CalendarScreen;