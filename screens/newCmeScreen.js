import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, FlatList, Image } from 'react-native';
import Swipeout from 'react-native-swipeout';

import AddCmeScreen from '../components/addCmeScreen';
import Cmes from '../models/cmes';

import 'firebase/firestore'
import Firebase from '../backend/firebase'
import 'firebase/storage';
import * as firebase from 'firebase'


const fb = Firebase.shared;

const newCmeScreen = (props) => {
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const [list, setList] = useState([]);
    // const [ActiveRowKey, setActiveRowKey] = useState([]);

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

    var swipeoutBtns = [
        {
            text: 'Edit',
            backgroundColor: 'pink',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        },
        {
            text: 'Delete',
              backgroundColor: 'red',
              underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
          }
      ]

    useEffect(() => {
        const cmeRef = firebase.database().ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`)
        const onValuechange = cmeRef.on('value', (snapshot) => {
            const newList = [];

            snapshot.forEach((childSnapshot) => {

                newList.push({
                        key: childSnapshot.key,
                        cert: childSnapshot.val().cert,
                        exp: childSnapshot.val().exp,
                        image: childSnapshot.val().image,
                    });
                    
                
            });
            setList(newList);
            // setActiveRowKey(keys)
            console.log(newList);
        })
        
        return () => cmeRef.off('value', onValuechange)
      },[]);

    //   const cmeRef = firebase.database().ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`)
    //   cmeRef.on('value', (dataSnapshot) => {
    //     var aux = [];
    //     dataSnapshot.forEach((child) => {
    //       aux.push({
    //         date: child.val().date,
    //         notita: child.val().notita,
    //         id: child.key
    //       });
    //     });
    //     this.setState({all_notitas: aux});
    //   }

//     const handleDelete = (deleteKey, setDeleteKey) = {
//         firebase.database().ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`)
        
//  }

     const renderItem = ({item}) => {

        return (
            <Swipeout
            keyExtractor = {(item) => item.key}  
            right={swipeoutBtns} > 
                <View  style ={{flexDirection: 'row', marginVertical: '5%'}}>
                    <Text style={styles.cmeItem}>ID: {item.key}</Text>
                    <Text style={styles.cmeItem}>Cert: {item.cert}</Text>
                    <Text style={styles.cmeItem} >Exp: {item.exp}</Text>
                    <Image style={{flex: 2, height:150}} source={{uri: item.image}} />
                </View>
            </Swipeout>
    )};


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

            <View >
                <FlatList  
                    style={{ marginTop: '5%', flexGrow: 0, marginBottom: '10%' }}
                    data={list}
                    keyExtractor = { item => item.id}
                    renderItem={renderItem}
                />                
            </View>

        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    btn: {
        width: '100%',
        marginBottom: 15,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: 'black'

    },
    detailBox: {
        flex:            1,
        alignItems:      'center',
        borderColor:     'silver',
        borderLeftWidth: 1,
        marginLeft:      40,
    },
    cmeItem: {
        flex:       1,
        fontSize:   14,
        fontFamily: 'open-sans',
        textAlign:  'center',
        alignSelf:  'center',
        width:      '50%',
      }
});

export default newCmeScreen;