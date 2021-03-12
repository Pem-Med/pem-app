import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TouchableNativeFeedback, Platform, Text, StyleSheet } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Colors from '../constants/Colors';

const RadioModal = props => {
    /*
        Example of radioOptions:
        const radioOptions = [
            { label: 'Global Room', value: 0 },
            { label: 'Private', value: 1 }
        ];
    */
    const radioOptions = props.radioOptions;
    const modalVisible = props.visible;
    const [selectedOption, setSelectedOption] = useState(0);

    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                //on back button
                props.onClose();
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalHeader}>{props.headerText}</Text>
                    <View style={styles.radioButtonsContainer}>
                        <RadioForm
                            animation={false}
                        >
                            {/* To create radio buttons, loop through your array of options */}
                            {
                                radioOptions.map((obj, i) => (
                                    <RadioButton
                                        labelHorizontal={true}
                                        key={i}
                                        style={styles.radioButton}
                                    >
                                        <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            isSelected={selectedOption === i}
                                            onPress={(value) => setSelectedOption(value)}
                                            buttonInnerColor={Colors.primaryColor}
                                            buttonOuterColor={Colors.primaryColor}
                                            buttonSize={15}
                                        />
                                        <RadioButtonLabel
                                            obj={obj}
                                            index={i}
                                            labelHorizontal={true}
                                            onPress={(value) => setSelectedOption(value)}
                                            labelStyle={styles.radioLabel}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                    </View>
                    <View style={styles.modalButtonsContainer}>
                        <TouchableCmp
                            onPress={() => props.onCancel()}
                        >
                            <View style={styles.modalButton}>
                                <Text style={styles.buttonText}>CANCEL</Text>
                            </View>
                        </TouchableCmp>
                        <TouchableCmp
                            onPress={() => props.onSubmit(selectedOption)}
                        >
                            <View style={styles.modalButton}>
                                <Text style={styles.buttonText}>OK</Text>
                            </View>
                        </TouchableCmp>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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

export default RadioModal;
