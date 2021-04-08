import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import Swipeout from "react-native-swipeout";

import AddCmeScreen from "../components/addCmeScreen";
import Cmes from "../models/cmes";
import Colors from '../constants/Colors'

import "firebase/firestore";
import Firebase from "../backend/firebase";
import "firebase/storage";
import * as firebase from "firebase";
import { Card } from "react-native-paper";

const fb = Firebase.shared;

const newCmeScreen = (props) => {
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [list, setList] = useState([]);
  const [dataRow, setdataRow] = useState();
  

  const onSubmit = (cert, exp, image) => {

    console.log(typeof exp);
    const timeDate = exp.getTime();
    const cmes = new Cmes(cert, timeDate, image);
    
    console.log('Date: ' + exp)

    fb.AddCme(cmes).then(() => {
      Alert.alert(
        "Success",
        "Your cmes has been posted",
        [{ text: "OK", onPress: () => setIsVisibleForm(false) }],
        { cancelable: false }
      );
    });
  };

  const onClose = () => {
    setIsVisibleForm(false);
  };

  var swipeoutBtns = (id = [
    {
      text: "Edit",
      backgroundColor: "pink",
      underlayColor: "rgba(0, 0, 0, 1, 0.6)",
    },
    {
      text: "Delete",
      backgroundColor: "red",
      underlayColor: "rgba(0, 0, 0, 1, 0.6)",
      onPress: () => {
        //selected item gets deleted in the handleDelete method
        handleDelete();
      },
    },
  ]);

  useEffect(() => {
    const cmeRef = firebase
      .database()
      .ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`)
      .orderByChild('exp');
    const onValuechange = cmeRef.on("value", (snapshot) => {
      const newList = [];
      snapshot.forEach((childSnapshot) => {

        const newDate = new Date(childSnapshot.val().exp);

        newList.push({
          key: childSnapshot.key,
          cert: childSnapshot.val().cert,
          exp: newDate,
          image: childSnapshot.val().image,
          id: childSnapshot.val().id
        });
      });
      setList(newList);
    });

    return () => cmeRef.off("value", onValuechange);
  }, []);

  function handleDelete() {

    //Deletes entire certification from Firebase > Realtime Database
    let deleteRef = firebase
      .database()
      .ref(
        `userCmes/userId: ${firebase.auth().currentUser.uid}/cmes/${dataRow.key}`
      );
    deleteRef.remove().then(function () {
    });

    //AND

    //Deletes image in Firebase > Storage > Uploads folder
    let imageRef = firebase.storage().ref(`uploads/${firebase.auth().currentUser.uid}/${dataRow.id}.jpg`);
    imageRef.delete().then(() =>{
    });

  }

  const renderItem = ({ item }) => {
    return (
      <View padding={10,10,10,10}>
      <Swipeout
        keyExtractor={(item) => item.key}
        close ={item !== item.key}
        right={swipeoutBtns}
        onOpen={() => {setdataRow(item)}} //when button is open, get item.key
      >

      <Card elevation ={10}>
        <Card.Cover source = {{uri: item.image}}/>
        <Card.Title title = {item.cert} subtitle={'Expires: ' + item.exp}/>
       </Card>
      </Swipeout>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../components/img/colors3.jpeg")}
        style={styles.background}
      >
        <View>
          <AddCmeScreen
            visible={isVisibleForm}
            header="Add Document"
            onSubmit={onSubmit}
            onClose={onClose}
          />
          <TouchableOpacity style={styles.btn}>
            <Text
            style={styles.addBtn}
            onPress={() => setIsVisibleForm(true)}
            >Add Document</Text>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            style={{ marginTop: "5%", flexGrow: 0, marginBottom: "10%" }}
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  background: {
    width: "100%",
    height: "100%",
  },
  addBtn:{
    fontFamily: "open-sans-bold",
    textAlign: "center",
    color: Colors.androidCustomWhite,
  },
  btn: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    width: 250,
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
  },
  detailBox: {
    flex: 1,
    alignItems: "center",
    borderColor: "silver",
    borderLeftWidth: 1,
    marginLeft: 40,
  },
  cmeItem: {
    flex: 1,
    fontSize: 14,
    fontFamily: "open-sans",
    textAlign: "center",
    alignSelf: "center",
    width: "50%",
  },
});

export default newCmeScreen;
