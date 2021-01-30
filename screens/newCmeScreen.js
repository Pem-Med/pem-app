import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, SafeAreaView, Card } from 'react-native';

import AddCmeScreen from '../components/addCmeScreen';
import Cmes from '../models/cmes';

import 'firebase/firestore'
import Firebase from '../backend/firebase'
import 'firebase/storage';
import { FlatList } from 'react-native-gesture-handler';


const fb = Firebase.shared;


const newCmeScreen = props => {
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const [cmes, setCmes] = useState([]);

    const onSubmit = (cert, exp, image) => {
        const cmes = new Cmes(cert, exp, image);
        fb.AddCme(cmes).then(() => {
            Alert.alert('Success', 'Your cmes has been posted',
                [
                    { text: "OK", onPress: () => setIsVisibleForm(false) }
                ],
                { cancelable: false });
        });
    };

    const onClose = () => {
        setIsVisibleForm(false);
    }

    const onDismiss = () => {
            Alert.alert('Oops', 'You sure you want to cancel?',
                [
                    { text: "Yes, cancel", onPress: () => setIsVisibleForm(false) }
                ],
                { cancelable: false });

    }


    return (
        <View style={styles.container}>
            <View>
                <AddCmeScreen visible={isVisibleForm}
                    header='Add Document'
                    onSubmit={onSubmit}
                    onClose={onClose}
                    onDismiss={onDismiss}
                />
                <View style={styles.btn}>
                    <Button title='Add Document' onPress={() => setIsVisibleForm(true)} />
                </View>
            </View>
            <SafeAreaView >
            <ScrollView>
            <FlatList >
            {cmes.map((item) => {
                return (
                    <View>
                     <Text>{item.cert}</Text>
                    </View>
                );
            })}
            </FlatList>
            </ScrollView>
            </SafeAreaView >

        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    btn: {
        width: '100%',
        marginBottom: 15,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: 'black'

    }
});

export default newCmeScreen;