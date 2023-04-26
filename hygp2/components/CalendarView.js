import { Calendar } from "react-native-calendars";
import { StyleSheet } from "react-native";

function CalendarView({ markedDates, selectedDate, onSelectDate }) {
    const markedSelectedDate = {
      ...markedDates,
      [selectedDate]: {
        ...markedDates[selectedDate],
        selected: true,
        textColor: "#ffffff",
      },
    };
  
    return (
      <Calendar
        markedDates={markedSelectedDate}
        markingType={"multi-period"}
        onDayPress={(day) => {
            onSelectDate(day.dateString);
        }}
        theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e",
            dotColor: "#aaaaaa",
        }}
    />
  );
}

export default CalendarView;
