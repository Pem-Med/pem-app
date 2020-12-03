import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback, Image, Dimensions, ImageBackground
} from 'react-native';


import Colors from "../constants/Colors";

function backgroundTileColor(props){
  switch (props.title) {
    case "Medical":
      return Colors.medicalTile
          break
    case "Surgical":
      return Colors.surgicalTile
          break
    case "Trauma":
      return Colors.traumaTile
          break
    case "Toxicology":
      return Colors.toxicologyTile
          break
    case "Foreign Ingestion":
      return Colors.foreignTile
          break
    default:
      return 'white'
  }
}

const CategoryGridTile = props => {
  let TouchableCmp = TouchableOpacity;
  //console.log("***Props PER ITEM***: ", props)
  let tileBackGroundColor = backgroundTileColor(props);
  let image = undefined
  switch (props.title) {
    case "Medical":
      image = require('../assets/icons/medical-icon-white-filled-96.png')
      break
    case "Surgical":
        image = require('../assets/icons/surgical-icon-white-80.png')
          break
    case "Trauma":
        image = require('../assets/icons/trauma-icon-white-80.png')
          break
    case "Toxicology":
        image = require('../assets/icons/toxicology-icon-white-80.png')
          break
    case "Foreign Ingestion":
        image = require('../assets/icons/foreign-ingestion-icon-white-96.png')
          break
    case "Emergent Rashes":
        image = require('../assets/icons/emergent-rashes-icon-64.png')
          break
  }
  //console.log("content in image: ", image)
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  return (
      <View style={styles.gridItem}>
        <View style={{ ...styles.container, ...{ backgroundColor:tileBackGroundColor } }}>
          <View style={styles.touchable}>
            <TouchableCmp onPress={props.onSelect} useForeground>
              <View style={styles.infoContainer}>
                <View style={styles.textContainer}>
                  <View style={styles.profileImage}>
                    <Image source={image} style={styles.avatar} resizeMode="cover" />
                  </View>
                  <Text style={styles.title}>
                    {props.title}
                  </Text>
                </View>
              </View>
          </TouchableCmp>
        </View>
    </View>
  </View>
  )
}
const styles = StyleSheet.create({
  gridItem:{
    flex: 1,
    //marginTop: 20,
    paddingBottom: 5,
    height: 175,
  },
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
    //height: 30,
    //Used with TILE Element
    marginLeft: 2.5,
    width: '98.5%',

  },
  textContainer: {
    // width: '100%',
    // height: '60%',
     alignItems: 'center',
    // padding: 30
  },
  infoContainer: {
    width:          '100%',
    height:         '100%',
    justifyContent: 'center',
    alignItems:     'center',
  },
  touchable: {
    overflow:     'hidden',
    borderRadius: 10,
  },
  title: {
    fontFamily: 'helvetica',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  }

});

export default CategoryGridTile;
