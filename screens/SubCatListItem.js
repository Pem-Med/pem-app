import React from "react";
// import {
//   TouchableOpacity,
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TouchableNativeFeedback,
//   Image,
//   Dimensions,
//   ImageBackground,
// } from "react-native";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableNativeFeedback,
  Dimensions,
  ImageBackground,
} from "react-native";
//import styles from "react-native-phone-input/lib/styles";
import Colors from "../constants/Colors";

const SubCatListItem = (props) => {
  //let title = props.navigation.getParam('categoryTitle') //get category title
  //console.log("PROPS EN SUBCAT LIST ITEM: ", props )
  // let formattedIconPath;
  // if (props.title === "Pneumonia") {
  //   formattedIconPath = "" + props.icon;
  //   // console.log(props)
  // }

  // //let icon = (props.icon === undefined) ? require("../assets/icons/image-placeholder-icon-64.png") : require("../assets/icons/image-placeholder-icon-64.png")
  // if (props.title == "Pneumonia") {
  //   icon = require("../assets/icons/pneumonia-icon-100.png");
  // } else if (props.title == "Appendicitis") {
  //   icon = require("../assets/icons/appendix-icon-512.png");
  // } else if (props.title == "ACETAMINOPHEN") {
  //   icon = require("../assets/icons/acetaminophen-icon-96.png");
  // } else if (props.title == "SPINE") {
  //   icon = require("../assets/icons/spine-icon-96.png");
  // } else if (props.title == "HEAD") {
  //   icon = require("../assets/icons/head-icon-100.png");
  // } else if (props.title == "Fever in immunosuppressed") {
  //   icon = require("../assets/icons/fever-icon-64.png");
  // } else if (props.icon === undefined) {
  //   icon = require("../assets/icons/image-placeholder-icon-64.png");
  // }

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    /*<View style={styles.gridItem}>
            <View style={{ ...styles.container, ...{ backgroundColor: props.color } }}>
                <View style={styles.touchable}>
                    <TouchableCmp onPress={props.onSelect} useForeground>
                        <View style={styles.infoContainer}>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>
                                    {props.title}
                                </Text>
                            </View>
                        </View>
                    </TouchableCmp>
                </View>
            </View>
        </View>*/
    <View style={styles.gridItem}>
      <View
        style={{ ...styles.container, ...{ backgroundColor: Colors.white } }}
      >
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <View style={styles.infoContainer}>
              {/* <Image source={icon} style={styles.image} /> */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{props.title}</Text>
              </View>
            </View>
          </TouchableCmp>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginTop: 5, //10
    marginBottom: 10, //10
  },
  container: {
    flex: 1,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    width: "98%", //80
    height: 50, //60
    marginLeft: "1%", //10
    marginRight: "1%", //5
    marginHorizontal: 1,
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    // alignItems: 'center',
  },
  touchable: {
    overflow: "hidden",
    borderRadius: 20,
  },
  // image: {
  //   justifyContent: "flex-start",
  //   height: 50,
  //   width: 50,
  //   resizeMode: "contain",
  //   marginTop: 5,
  //   marginLeft: 5,
  //   borderRadius: 30,
  // },
  title: {
    justifyContent: "flex-start",
    fontFamily: "helvetica",
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default SubCatListItem;
