import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Permissions from "expo-permissions"
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

const utcDateToString = momentInUTC => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
};

const CalendarScreen = () => {
    //var today = new Date();
    const [eventTitle, setEventTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [textBoxWidth, SetTextBoxWidth] = useState('99%');

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

    const [date, setDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status != "granted") {
                alert("We need permission to use your calendar");
            }
        })();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            SetTextBoxWidth(prev => '100%');
        }, 100);
    }, [textBoxWidth]);

    const details = {
        title: eventTitle,
        startDate: utcDateToString(date),
        endDate: utcDateToString(endDate),
        notes: notes,
    };

    const clearFields = () => {
        setEventTitle('');
        setNotes('');
        setDate('');
        setEndDate('')
    }

    async function createCalendar() {
        const defaultCalendarSource = { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Expo Calendar',
          color: 'blue',
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: 'internalCalendarName',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        console.log(`Your new calendar ID is: ${newCalendarID}`);
      }


    async function createEventInCalendar() {

        const calendars = await Calendar.getCalendarsAsync()

        if (Platform.OS == "ios") {
            const calendar = await Calendar.getDefaultCalendarAsync();
            Calendar.createEventAsync(calendar.id, details)
            alert("Event has been saved")
            clearFields()
        } else {
            console.log({calendars})
        }
    }

    const saveEventAlert = () => {
        if (eventTitle && date && endDate) {
            Alert.alert(
                'Saving Event',
                'Are you sure you want to save event?' + JSON.stringify(details, null, 1),
                [
                    { text: 'Cancel', onPress: () => { return null } },
                    {
                        text: 'Confirm', onPress: createEventInCalendar
                    },
                ],
                { cancelable: false }
            )
        } else {
            alert("Event title and/or Date fields cannot be empty")
        }
    }

    const showStartDatepicker = () => {
        setDatePickerVisibility(true);
    };

    const showEndDatepicker = () => {
        setEndPickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const hideEndDatePicker = () => {
        setEndPickerVisibility(false);
    };

    const handleStartConfirm = (dateTime) => {
        setDate(dateTime);
        hideStartDatePicker();
    };

    const handleEndConfirm = (dateTime) => {
        if (dateTime < date) {
            alert("End date cannot be less than start date")
        } else {
            setEndDate(dateTime);
            hideEndDatePicker();
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Add New Event to Calendar
          </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Please enter event title"
                    style={styles.input}
                    value={eventTitle}
                    onChangeText={text => setEventTitle(text)}
                    selectTextOnFocus={true}
                />
                <TextInput
                    style={[styles.input, { width: textBoxWidth }]}
                    value={notes}
                    placeholder="Please enter event notes"
                    multiline={true}
                    onChangeText={text => setNotes(text)}
                    selectTextOnFocus={true}
                />
                <View style={{ marginTop: "5%" }}>
                    <TouchableOpacity onPress={showStartDatepicker} style={{ marginBottom: "4%", alignSelf: "center", flexDirection: 'row' }}>
                        <Text style={styles.text}>Select Start Time of Event: </Text>
                    </TouchableOpacity>
                    {date ?
                        <Text style={{ alignSelf: "center" }}>
                            {moment
                                .utc(date)
                                .local()
                                .format('lll')}</Text>
                        : <Text></Text>
                    }
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        value={date}
                        mode='datetime'
                        onConfirm={handleStartConfirm}
                        onCancel={hideStartDatePicker}
                    />
                </View>
                <View style={{ marginTop: "5%" }}>
                    <TouchableOpacity onPress={showEndDatepicker} style={{ marginBottom: "4%", alignSelf: "center", flexDirection: 'row' }}>
                        <Text style={styles.text}>Select End Time of Event: </Text>
                    </TouchableOpacity>
                    {endDate ?
                        <Text style={{ alignSelf: "center" }}>
                            {moment
                                .utc(endDate)
                                .local()
                                .format('lll')}</Text>
                        : <Text></Text>
                    }
                    <DateTimePickerModal
                        isVisible={isEndPickerVisible}
                        value={endDate}
                        mode='datetime'
                        onConfirm={handleEndConfirm}
                        onCancel={hideEndDatePicker}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={saveEventAlert}>
                <Text style={[styles.text, { color: 'white' }]}>Save Event</Text>
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        //backgroundColor: 'white',
        paddingTop: "15%"
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.primaryColor,
        fontWeight: "bold"
    },
    inputContainer: {
        width: '66%',
        marginVertical: 10
    },
    text: {
        fontSize: 16,
        color: Colors.primaryColor,
        marginVertical: 5,
        alignSelf: 'center'
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        fontSize: 14,
        marginVertical: "10%",
        borderBottomColor: Colors.primaryColor,
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        padding: 10,
        marginTop: 30,
        borderRadius: 20
    }
});

export default CalendarScreen;

