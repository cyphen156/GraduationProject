import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Table, Row } from 'react-native-table-component';
import PercentageCircle from './PercentageCircle';
import { ScrollView } from 'react-native-gesture-handler';

function TeamDashboard() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const tableHead = ['Name', 'Age', 'Gender'];
  const tableData = [
    ['John', '25', 'Male'],
    ['Jane', '31', 'Female'],
    ['Bob', '19', 'Male'],
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Data</Text>
        <LineChart
          data={data}
          width={300}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>유저</Text>
         <Table borderStyle={styles.table}>

           <Row data={tableHead} style={styles.tableHead} textStyle={styles.tableHeaderText} />
            {tableData.map((rowData, index) => (
            <Row key={index} data={rowData} style={styles.tableRow} textStyle={styles.tableRowText} />
          ))}  

        </Table> 
      </View>
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>작업 진행량</Text>
        <PercentageCircle percentage={70}/>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5FCFF',
    },
    chartContainer: {
      alignItems: 'center',
      backgroundColor: '#81C784',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
    },
    chartTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#FFFFFF',
    },
    tableContainer: {
      backgroundColor: '#FFFFFF',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
    },
    tableTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    tableHead: {
      backgroundColor: '#81C784',
      padding: 8,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    tableRow: {
      backgroundColor: '#FFFFFF',
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
    },
    tableHeaderText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    tableRowText: {
      fontSize: 14,
      color: '#333333',
    },

});

export default TeamDashboard;

