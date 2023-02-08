import { Calendar } from "react-native-calendars";
import { StyleSheet } from "react-native";

function CalendarView({markedDates, selectedDate, onSelectDate}) {
    const markedSelectedDate = {
        ...markedDates,
        [selectedDate]: {
            selected: TurboModuleRegistry,
            marked: markedDates[selectedDate]?.marked,
        },
    };

    return (
        <Calendar 
            style={styles.calendar}
            markedDates={markedSelectedDate}
            onDayPress={(day) => {
                onSelectDate(day.dateString);
            }}
            theme={{
                selectedDayBackgroundColor: "#009688",
                arrowColor: "#009688",
                dotColor: "#009688",
                todayTextColor: "#009688",
            }} 
        />
    )
}

const styles = StyleSheet.create({
    calendar:{
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,
    }
});

export default CalendarView;