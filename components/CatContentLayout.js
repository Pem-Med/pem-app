import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CatContentLayout = props => {
    const [showDetails, setShowDetails] = useState(false);
    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.orderItem}>
            <View style={styles.container} >
                <View style={styles.touchable}>
                    <TouchableCmp onPress={() => { setShowDetails(prevState => !prevState) }} useForeground>
                        <View style={styles.textContainer} >
                            <Text style={styles.title}>{props.name}</Text>
                        </View>
                    </TouchableCmp>
                </View>
            </View >
            <View style={styles.textBackgroundContainer}>
                {showDetails &&
                    <View style={styles.detailItems}>
                        <Text style={styles.textSize}>
                            {props.evaluation}
                            {props.management}
                            {props.medications}
                            {props.signs}
                            {props.references}
                        </Text>

                    </View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        flex: 1,
        // margin: 10,
        paddingTop: 30
    },
    detailItems: {
        paddingTop: 5,
        paddingHorizontal: 15,
        width: '80%',
        //backgroundColor: 'white'

    },
    textBackgroundContainer: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 25,
        backgroundColor: Colors.primaryColor,
        width: '80%',
        height: 40,
        marginLeft: '10%',
        marginRight: '10%'

    },
    touchable: {
        overflow: 'hidden',
        borderRadius: 10,
    },
    textContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontFamily: 'open-sans',
        color: 'white'
    },
    textSize: {
        // fontSize: 15,
        // alignItems: 'center',
        fontFamily: 'open-sans',
        // textAlign: "left"
    }

});

export default CatContentLayout;