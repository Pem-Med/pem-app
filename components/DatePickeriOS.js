import React, { useState } from "react";
import { View, StyleSheet, TouchableHighlight, Modal } from "react-native";
import moment from "moment";
import { Picker } from "react-native-wheel-pick";
import { Button, TextInput, Text } from "react-native-paper";

const DatePickeriOS = (props) => {
  const [show, setShow] = useState(false);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState([dates]);

  const dates = new Date(year,month,day);

  let months = [
    "Month",
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
    "Day",
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ];

  let years = [
    "Year",
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
    2031,
  ];

  const onConfirm = () => {
    props.onConfirm(month, day, year);
    const dates = moment().date(day).month(month).year(year).format("LL");
    setDate(dates);
    setShow(false);
  };

  return (
    <TouchableHighlight activeOpacity={0} onPress={() => setShow(true)}>
      <View >
        <View >
          <Text style={styles.rowExp} label="Expiration Date">  Expiration date: {date}</Text>
        </View>

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
                    <View style={styles.rowWheels}>
                      <Picker
                        style={{
                          backgroundColor: "white",
                          width: 150,
                          height: 180,
                        }}
                        onValueChange={(date) => {
                          setMonth(date);
                        }}
                        selectedValue={"Month"}
                        pickerData={months}
                      />
                      <Picker
                        style={{
                          width: 70,
                          height: 180,
                          backgroundColor: "white",
                        }}
                        onValueChange={(date) => {
                          setDay(date);
                        }}
                        selectedValue={"Day"}
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
                        selectedValue={"Year"}
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
  rowWheels: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowExp: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    padding: 15,
    marginTop: 10,
    borderRadius: 1,
    borderWidth: 1,
    backgroundColor: "white",
    textAlign: "left",
    alignItems: "stretch",
    fontSize: 17,
    width: 325,
    height: 50,
    borderColor: "grey",
    color: 'grey'
  },
});

export default DatePickeriOS;
