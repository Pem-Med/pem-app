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

export const deleteItem = (item) => {
    return (dispatch)=>{
        
    }
}

const newCmeScreen = (props) => {
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const [list, setList] = useState([]);
    const [deleteItem, setdeleteItem] = useState([]);
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

    var swipeoutBtns = (id) = [
        {
            text: 'Edit',
            backgroundColor: 'pink',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        },
        {
            text: 'Delete',
              backgroundColor: 'red',
              underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                handleDelete();
                console.log('Deleted!')
            }
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

          //childSnapshot.child(id).remove()


      function handleDelete (){


        // console.log('Deleted working?')
         let deleteRef = firebase.database().ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes/${deleteItem}`);
         deleteRef.remove().then(function() {
            console.log("Deleted: " + deleteItem);
         });
      }

     const renderItem = ({item}) => {

        return (
            <Swipeout
            keyExtractor = {(item) => item.key}  
            right={swipeoutBtns} onOpen = {() => setdeleteItem(item.key)}> 
                <View style ={{flexDirection: 'row', marginVertical: '5%'}}>
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
                    onPress = {() => handleDelete(item.key)}
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