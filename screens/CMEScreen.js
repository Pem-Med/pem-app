import React, { Component, useEffect } from "react";
import DatePicker from "react-native-datepicker";
import * as ImagePicker from 'expo-image-picker';
import Colors from "../constants/Colors";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import Firebase from "../backend/firebase";

//This will be the list of all CMEs the user has.
let cmes = [];

//This represents one CME the user would like to
//add to the list of CMEs.
let newCme = {
  newCmeCert: "",
  newCmeExp: "",
  newCmePic: "",
};


function displayOKAlert(title, message) {
  Alert.alert(title, message);
}

export default class CME extends Component {
  /**
   * This constructor initializes the cmes array.
   * @param {Object} props
   */
  constructor(props) {
    firebase
      .database()
      .ref("userCmes/userId:" + firebase.auth().currentUser.uid)
      .once("value")
      .then(function (snapshot) {
        console.log("SNAPSHOT.VAL", snapshot.val());
        cmes = snapshot.val() === null ? [] : snapshot.val().cmes;
      })
      .catch(function (err) {
        console.log("ERROR GETTING CME DATA:", err);
      });
    super(props);
    this.state = {
      cmes: cmes,
    };
    console.log("BEGINNING STATE IS", this.state.cmes);
    this.handleCmeCert = this.handleCmeCert.bind(this);
    this.handleCmeExp = this.handleCmeExp.bind(this);
    this.handleCmePic = this.handleCmePic.bind(this);
    this.addCme = this.addCme.bind(this);
  }
  static navigationOptions = {
    title: "CME",
  };

  handleCmeCert(text) {
    newCme.newCmeCert = text;
  }

  handleCmeExp(date) {
    newCme.newCmeExp = date;
  }

  handleCmePic(text) {
    newPic.newCmePic = text;
  }

  /**
   * Checks the userDate the user input to see if it's a valid date.
   * "Valid", in this case, simply means "is a date" and "is tomorrow
   * or later".
   * @param {string} userDate
   */
  isValidDate(userDate) {
    console.log("USERDATE", userDate);
    let expDateMillis = Date.parse(userDate);
    console.log("EXPDM", expDateMillis);
    console.log("EXPDMbool", expDateMillis === NaN);
    console.log("EXPDMbool2", expDateMillis == NaN);
    console.log("EXPDM2", expDateMillis);
    console.log("EXPDMbool3", !expDateMillis);
    if (!expDateMillis) {
      console.log("RETURNING FIRST FALSE");
      displayOKAlert(
        "Invalid date format",
        "Please format your date as MM/DD/YYYY"
      );
      return false;
    }
    let today = new Date();
    let todayMillis = Date.parse(
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear()
    );

    if (todayMillis - expDateMillis >= 0) {
      /*
      If todayMillis - expDateMillis >= 0, then that means that the renewal date is either the same day
      or earlier than the current date. I'm not allowing this since renewal dates supposed to be in the
      future.
      */
      displayOKAlert(
        "Invalid date",
        "Please make sure your date is later than today"
      );
      return false;
    }
    console.log("RETURNING TRUE");
    return true;
  }

  /**
   * Adds a newCme to the cmes array. It checks if the newCmeCert field is
   * NOT empty and if newCmeExp is a valid date. If both of those check out,
   * newCme is added and this.state.cmes is set to the cmes list. It also
   * sets the userCmes in Firebase to the cmes list.
   */
  addCme() {
    console.log("NEWCME:", newCme);
    if (newCme.newCmeCert != "" && this.isValidDate(newCme.newCmeExp)) {
      cmes.push({
        cert: newCme.newCmeCert,
        exp: newCme.newCmeExp,

      });

      this.setState({
        cmes: cmes,
      });
      console.log("STATE IS", this.state);

      firebase
        .database()
        .ref("userCmes/userId:" + firebase.auth().currentUser.uid)
        .set({
          cmes: cmes,
        })
        .catch(function (err) {
          console.log("ERROR IN SETTING userCmes/userId:", err);
        });
    } else {
      console.log(
        "One or both of the fields in newCme are empty. We can't have that."
      );
    }
  }

  render() {
    return (
      <View>
        <FlatList
          style={{ marginTop: "5%", flexGrow: 0, marginBottom: "2%" }}
          data={this.state.cmes}
          keyExtractor={item => item.id}
          renderItem={(itemData) => (
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.cmeItem}>{(itemData.item.id, itemData.item.cert)}</Text>
              <Text style={styles.cmeItem}>{(itemData.item.id + 1, itemData.item.exp)}</Text>
            </View>
          )}
          numColumns={1}
        />

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.header}>Add New Certification Here</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.textField}
            onChangeText={this.handleCmeCert}
            placeholder="Certification Name"
          />
        </View>

        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.header}>Renewal Date</Text>
          <DatePicker
            style={{
              flex: 1,
              alignSelf: "center",
              width: "80%",
              marginRight: "9%",
              marginTop: "2%"
            }}
            date={this.state.date} //initial date from state
            mode="date"
            placeholder="Select date"
            format="MM/DD/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(date) => { this.setState({ date: date }, this.handleCmeExp(date)) }}
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
          />
        </View>

        <View style={{ flexDirection: "column", marginTop: "15%" }}>
          <View style={[styles.addCmeButton, { flexDirection: 'column', backgroundColor: Colors.primaryColor }]}>
            <TouchableOpacity style={styles.buttonText} onPress={pickImage}>
              <Text style={styles.text}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addCmeButton} onPress={this.addCme}>
            <Text style={styles.text}>Add CME</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const pickImage = async () => {
  let selectedImage = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });
  if (!selectedImage.cancelled) {
    //setAvatar(selectedImage.uri);
  }
};

const styles = StyleSheet.create({
  textField: {
    flex: 1,
    fontFamily: "open-sans",
    height: 60,
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 30,
    margin: 8,
  },
  header: {
    flex: 1,
    fontSize: 20,
    fontFamily: "open-sans",
    textAlign: "center",
    alignSelf: "center",
    width: "80%",
  },
  text: {
    fontFamily: "open-sans",
    textAlign: "center",
    color: "white"
  },
  addCmeButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
    width: 250,
    backgroundColor: Colors.primaryColor,
    borderRadius: 30,
  },
  cmeItem: {
    flex: 1,
    fontSize: 14,
    fontFamily: "open-sans",
    textAlign: "center",
    alignSelf: "center",
    width: "80%",
  },
});
