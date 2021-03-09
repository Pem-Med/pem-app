import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Alert,
  FlatList,
  Image,
  ImageBackground
} from "react-native";
import Swipeout from "react-native-swipeout";

import AddCmeScreen from "../components/addCmeScreen";
import Cmes from "../models/cmes";

import "firebase/firestore";
import Firebase from "../backend/firebase";
import "firebase/storage";
import * as firebase from "firebase";

const fb = Firebase.shared;

const newCmeScreen = (props) => {
  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const [list, setList] = useState([]);
  const [dataRow, setdataRow] = useState([]);
  // const [ActiveRowKey, setActiveRowKey] = useState([]);

  const onSubmit = (cert, exp, image) => {
    const cmes = new Cmes(cert, exp, image);
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

  const onDismiss = () => {
    Alert.alert(
      "Oops",
      "You sure you want to cancel?",
      [{ text: "Yes, cancel", onPress: () => setIsVisibleForm(false) }],
      { cancelable: false }
    );
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
      .ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`);
    const onValuechange = cmeRef.on("value", (snapshot) => {
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
      console.log(newList);
    });

    return () => cmeRef.off("value", onValuechange);
  }, []);

  function handleDelete() {
    let deleteRef = firebase
      .database()
      .ref(
        `userCmes/userId: ${firebase.auth().currentUser.uid}/cmes/${dataRow}`
      );
    deleteRef.remove().then(function () {
      console.log("Delete: " + dataRow);
    });
  }

  const renderItem = ({ item }) => {
    return (
      <Swipeout
        keyExtractor={(item) => item.key}
        right={swipeoutBtns}
        onOpen={() => setdataRow(item.key)} //when button is open, get item.key
      >
        <View style={{ flexDirection: "row", marginVertical: "5%" }}>
          <Text style={styles.cmeItem}>Cert: {item.cert}</Text>
          <Text style={styles.cmeItem}>Exp: {item.exp}</Text>
          <Image
            style={{ flex: 2, height: 150 }}
            source={{ uri: item.image }}
          />
        </View>
      </Swipeout>
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
            onDismiss={onDismiss}
          />
          <View style={styles.btn}>
            <Button title="Add Document" onPress={() => setIsVisibleForm(true)} />
          </View>
        </View>

        <View>
          <FlatList
            style={{ marginTop: "5%", flexGrow: 0, marginBottom: "10%" }}
            data={list}
            keyExtractor={(item) => item.id}
            onPress={() => handleDelete(item.key)}
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
    width:  '100%',
    height: '100%',
  },
  btn: {
    width: "100%",
    marginBottom: 15,
    marginTop: 10,
    justifyContent: "center",
    backgroundColor: "black",
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
