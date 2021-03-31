import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Modal,
} from "react-native";
import moment from 'moment'
import { Picker } from "react-native-wheel-pick";
import { Button, TextInput, Text } from "react-native-paper";


const DatePickeriOS = (props) => {

  const [show, setShow] = useState(false);
  const [month, setMonth] = useState([]);
  const [day, setDay] = useState([1]);
  const [year, setYear] = useState([2021]);
  const[date, setDate] = useState([])

  
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let days = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
    21,22,23,24,25,26,27,28,29,30,31,
  ];

  let years = [
    2020,
    2021,
    2022,
    2024,
    2025,
    2026,
    2027,
    2028,
    2029,
    2030,
    2031
  ];
  

  const onConfirm = () => {
    props.onConfirm(month,day,year);
    const dates = moment().date(day).month(month).year(year).format("LL");
    setDate(dates);
  }

  return (
    <TouchableHighlight activeOpacity={0} onPress={() => setShow(true)}>
      <View>
        <Button>Expiration date: <TextInput placeholder="Select Date">{date}</TextInput></Button>
        
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          supportedOrientations={["portrait"]}
          onRequestClose={() => setShow(false)}
        >
          <View style={{ flex: 1 }}>
            <TouchableHighlight
              style={{
                flex: 1,
                alignItems: "flex-end",
                flexDirection: "row",
              }}
              activeOpacity={1}
              visible={show}
              onPress={() => setShow(false)}
            >
              <TouchableHighlight
                underlayColor={"#FFFFFF"}
                style={{
                  flex: 1,
                  borderTopColor: "#E9E9E9",
                  borderTopWidth: 1,
                }}
                
              >
                <View
                  style={{
                    backgroundColor: `#FFFFFF`,
                    height: 300,
                    overflow: "hidden",
                  }}
                >
                  <View>
                    <View style={styles.rowItem}>
                      <Button onPress={() => setShow(false)}>
                        <Text>Cancel</Text>
                      </Button>
                      <Button onPress={() => onConfirm()}>Confirm</Button>
                    </View>
                    <View style={styles.rowItem}>
                      <Picker
                        style={{
                          backgroundColor: "white",
                          width: 150,
                          height: 180,
                        }}
                        onValueChange={(date) => {
                          setMonth(date);
                        }}
                        selectedValue={1}
                        pickerData={months}
                      />
                      <Picker
                        style={{
                          width: 50,
                          height: 180,
                          backgroundColor: "white",
                        }}
                        onValueChange={(date) => {
                          setDay(date);
                        }}
                        selectedValue={1}
                        pickerData={days}
                      />
                      <Picker
                        style={{
                          width: 150,
                          height: 180,
                          backgroundColor: "white",
                        }}
                        onValueChange={(date) => {
                          setYear(date);
                        }}
                        selectedValue={2021}
                        pickerData={years}
                      />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
});

export default DatePickeriOS;
