import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, ScrollView, SafeAreaView, Card } from 'react-native';

import AddCmeScreen from '../components/addCmeScreen';
import * as firebase from 'firebase'
import 'firebase/firestore'
import Firebase from '../backend/firebase'
import 'firebase/storage';
import Cmes from '../models/cmes';


const fb = Firebase.shared;

const numColumns = 3;

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

    

    useEffect(() => {
        const list = [];
        fb.GetCmesRef(cmes)
        .once('value', snap => {
            snap.forEach(function(result) {
              firebase
                .database()
                .ref('cmes')
                .child(result.key)
                .once('value', snap => {
                  if (snap.val()) list.push(snap.val());
                });
            });
          })
          .then(function() {
            setCmes(list);
        });
    }, [isVisibleForm]);

    return (
        <View style={styles.container}>
            <View style={styles.btn}>
                <AddCmeScreen visible={isVisibleForm}
                    header='Add Document'
                    onSubmit={onSubmit}
                    onClose={onClose}
                />
                <View style={styles.btn}>
                    <Button title='ADD' onPress={() => setIsVisibleForm(true)} />
                </View>
            </View>
            <SafeAreaView >
            <ScrollView>
            <Text style={styles.card} >
            {cmes.map((item) => {
                return (
                    <View>
                     <Card.Title>{item.cert}</Card.Title>
                     <Card.Divider/>
                     <Card.Image source={{ uri: item.image }} />
                     <Text>
                         {item.exp}
                     </Text>
                    </View>
                );
            })}
            </Text>
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
    card: {
        backgroundColor: '#2089dc',
        margin: 20,
        width: '100%', 
        height: 100,
        justifyContent: 'center',
    },
    btn: {
        width: '95%',
        marginBottom: 15,
        marginTop: 10
    }
});

export default newCmeScreen;