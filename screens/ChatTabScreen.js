import React, { useState, useCallback, useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet, Platform, TouchableNativeFeedback } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import ChatList from '../components/Chat';
import Colors from '../constants/Colors';
import { IconButton } from 'react-native-paper';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';


/**
 * The ChatTabScreen component is the first thing in the hierarchy of the chat's functionality. It's the first thing 
 * a user sees when they click on the chat section, and is meant to display all the chat rooms
 */
const ChatTabScreen = (props) => {
    const radio_props = [
        { label: 'Global Room', value: 0 },
        { label: 'Private', value: 1 }
    ];
    const [chatType, setChatType] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    //set up handler for button on header to open the modal
    const createHandler = useCallback(() => {
        setModalVisible(true);
    }, [setModalVisible]);

    useEffect(() => {
        props.navigation.setParams({ create: createHandler })
    }, [createHandler]);

    return (
        <View style={styles.screen}>
            <ChatList navigation={props.navigation} ></ChatList>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    //on back button
                    setModalVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>Choose the type of chat:</Text>
                        <View style={styles.radioButtonsContainer}>
                            <RadioForm
                                animation={false}
                            >
                                {/* To create radio buttons, loop through your array of options */}
                                {
                                    radio_props.map((obj, i) => (
                                        <RadioButton
                                            labelHorizontal={true}
                                            key={i}
                                            style={styles.radioButton}
                                        >
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i}
                                                isSelected={chatType === i}
                                                onPress={setChatType}
                                                buttonInnerColor={Colors.primaryColor}
                                                buttonOuterColor={Colors.primaryColor}
                                                buttonSize={15}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={setChatType}
                                                labelStyle={styles.radioLabel}
                                            />
                                        </RadioButton>
                                    ))
                                }
                            </RadioForm>
                        </View>
                        <View style={styles.modalButtonsContainer}>
                            <TouchableCmp
                                onPress={() => { setModalVisible(prev => !prev) }}
                            >
                                <View style={styles.modalButton}>
                                    <Text style={styles.buttonText}>CANCEL</Text>
                                </View>
                            </TouchableCmp>
                            <TouchableCmp
                                onPress={() => {
                                    //setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={styles.modalButton}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </View>
                            </TouchableCmp>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 5,
        paddingVertical: 5,
        backgroundColor: Colors.androidCustomWhite
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        paddingBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5

    },
    radioButtonsContainer: {
        marginTop: 35,
    },
    radioButton: {
        paddingBottom: 10
    },
    radioLabel: {
        fontSize: 18,
        paddingLeft: 20
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        padding: 15,
    },
    buttonText: {
        fontSize: 15,
        color: Colors.primaryColor,
        fontWeight: 'bold'
    },
    modalHeader: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold'
    }
});


ChatTabScreen.navigationOptions = navigationData => {
    return {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white'

        },
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),

        headerRight: () => (
            <IconButton
                icon='message-plus'
                size={28}
                color={Platform.OS === 'android' ? Colors.white : Colors.primaryColor}
                //onPress={() => navigationData.navigation.navigate('AddRoom')}
                onPress={navigationData.navigation.getParam('create')}
            />
        )
    }
};

export default ChatTabScreen; ChatTabScreen
