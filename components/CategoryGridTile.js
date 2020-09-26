import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback, Image, Dimensions, ImageBackground
} from 'react-native';




const CategoryGridTile = props => {
  let TouchableCmp = TouchableOpacity;
  //console.log("***Props PER ITEM***: ", props)
  let image = undefined
  switch (props.title) {
    case "Medical":
      image = require('../assets/icons/medical-icon-color-80.png')
      break
    case "Surgical":
        image = require('../assets/icons/surgical-icon-color-80.png')
          break
    case "Trauma":
        image = require('../assets/icons/trauma-icon-color-80.png')
          break
    case "Toxicology":
        image = require('../assets/icons/toxicology-icon-color-80.png')
          break
    case "Foreign Ingestion":
        image = require('../assets/icons/foreign-ingestion-icon-color-80.png')
          break
    case "Emergent Rashes":
        image = require('../assets/icons/emergent-rashes-icon-64.png')
          break
  }
  console.log("Title in props: ", props.title)
  console.log("content in image: ", image)
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
      <View style={styles.gridItem}>
        <View style={{ ...styles.container, ...{ backgroundColor: props.color } }}>
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
  );
};

const styles = StyleSheet.create({
  gridItem:{
    flex: 1,
    marginTop: 20,
    paddingBottom: 5,
    height: 175,
  },
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
   // borderRadius: 2,
    backgroundColor: 'white',
    //height: 30,
    marginHorizontal: 40,

  },
  textContainer: {
    // width: '100%',
    // height: '60%',
     alignItems: 'center',
    // padding: 30
  },
  infoContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  touchable: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  title: {
    fontFamily: 'helvetica',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  }

});

export default CategoryGridTile;
