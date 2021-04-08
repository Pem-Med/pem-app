import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Text,
  Platform,
  Image,
  Alert,
  Modal,
} from "react-native";
import moment from 'moment'
import * as ImagePicker from "expo-image-picker";
import { Button, TextInput } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import DatePickeriOS from "../components/DatePickeriOS";

const AddCmeScreen = (props) => {

  //These states are used for:
  //Capturing Certification name function
  const [cert, setCert] = useState("");

  //Capturing Image function
  const [image, setImage] = useState(null);

  //Capturing Expiration function
  const [exp, setExp] = useState(new Date());



  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Camera roll permission is needed to upload pcitures. *Pictures are optional."
          );
        }
      }
    })();
  }, []);

  const onDateChange = (date) => {
    const dates = new Date(date);
    console.log( typeof dates);
    setExp(dates);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onSubmit = () => {
    props.onSubmit(cert, exp, image);
    console.log("It submitted!");
  };

  const onConfirm = (month,day,year) => {
    var dates = new Date(month + ' ' + day+ ', ' +year);

    console.log(typeof month + '' + typeof day + '' + typeof year)
    
    //const dates = datess.moment().date(day).month(month).year(year).format("ll")
    console.log('Date added: ' +  dates)
    setExp(dates);
  }

  const onClose = () =>{
    props.onClose();
  }

  return (
    <SafeAreaView>
      <Modal visible={props.visible} animationType="slide">
        <ImageBackground
          source={require("../components/img/colors3.jpeg")}
          style={styles.background}
        >
          <ScrollView>
            <Text style={styles.title}>{props.header}</Text>
            <View style={styles.container}>
              {/* Name of certification */}
              {/* Start */}
              <View style={styles.rowItem}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    label="Certification name"
                    mode="outlined"
                    maxLength={40}
                    multiline
                    onChangeText={(text) => setCert(text)}
                    value={cert}
                  />
                </View>
              </View>
              {/* End */}

              {/* Date that certification expires */}
              {/* Start */}
              <View style={styles.rowItem}>
                
                {/* ANDROID */}
                {Platform.OS === "android" &&
                  (<View >
                    <DatePicker
                      mode='date'
                      date={exp}
                      onDateChange = {onDateChange}
                    />
                  </View>)}


                {/* iOS */}
                {Platform.OS === "ios" && <DatePickeriOS onConfirm={onConfirm} />}
              </View>
              {/* End */}

              {/* Pick and Add image */}
              {/* Start */}
              <View style={styles.rowItem}>
                <View style={styles.pickImg}>
                  <Button mode="contained" color={"blue"} onPress={pickImage}>
                    Pick image
                  </Button>
                </View>
                {!image && (<View style={styles.goBackBtn}>
                <Button
                  title="cancel"
                  mode="contained"
                  color={"blue"}
                  onPress={onClose}
                >
                  Go back
                </Button>
              </View>)}
                <View style={styles.removeBtn}>
                  {image && (
                    <Button
                      mode="contained"
                      color={"red"}
                      onPress={() => setImage(null)}
                    >
                      Remove
                    </Button>
                  )}
                </View>
              </View>
              {/* End */}

              <View style={styles.imageContainer}>
                {image && (
                  <Image
                    borderRadius={20}
                    source={{ uri: image }}
                    style={styles.image}
                  />
                )}
              </View>
            {image && (<View style={styles.submit}>
                <Button
                  title="cancel"
                  mode="contained"
                  color={"blue"}
                  onPress={onClose}
                >
                  Cancel
                </Button>
              </View>)}
              

              <View style={styles.submit}>
                {image && (
                  <Button
                    mode="contained"
                    color={"green"}
                    title="submit"
                    onPress={onSubmit}
                  >
                    Submit
                  </Button>
                )}
              </View>

              {/* End */}
            </View>
          </ScrollView>
        </ImageBackground>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  pickImg: {
    fontSize: 19,
    paddingTop: 10,
    alignContent: "center",
  },
  removeBtn: {
    paddingTop: 10,
    alignContent: "center",
  },
  goBackBtn: {
    paddingTop: 10,
    alignContent: "center",
    marginLeft: 100
  },
  label: {
    fontSize: 19,
    paddingVertical: 20,
    paddingRight: 20,
  },
  textInputContainer: {
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    width: "100%",
  },
  imageContainer: {
    alignItems: "center",
    color: "red",
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
  },

  title: {
    fontSize: 30,
    marginTop: 60,
    marginBottom: 30,
    textAlign: "center",
  },
  submit: {
    marginTop: 10,
  },
});

export default AddCmeScreen;
