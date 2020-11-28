import React from 'react'
import {
  TouchableOpacity, View, Text, StyleSheet, Platform, TouchableNativeFeedback, Image,
} from 'react-native'
import icons from '../assets/icons'

const CategoryGridTile = (props) => {
  let TouchableCmp = TouchableOpacity
  console.log('***Props PER ITEM***: ', props)
  let image
  switch (props.title) {
    case 'Medical': image = icons.medical
      break
    case 'Surgical': image = icons.surgical
      break
    case 'Trauma': image = icons.trauma
      break
    case 'Toxicology': image = icons.toxicology
      break
    case 'Foreign Ingestion': image = icons.foreign
      break
    case 'Emergent Rashes': image = icons.emergent
      break
    default:
      break
  }
  console.log('Title in props: ', props.title)
  console.log('content in image: ', image)
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  return (
    <View style={styles.gridItem}>
      <View style={{ ...styles.container, ...{ backgroundColor: props.color } }}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <View style={styles.infoContainer}>
              <View style={styles.textContainer}>
                <View style={styles.profileImage}>
                  <Image source={image} style={styles.avatar} resizeMode={'cover'} />
                </View>
                <Text style={styles.title}>{props.title}</Text>
              </View>
            </View>
          </TouchableCmp>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  gridItem: {
    flex:          1,
    marginTop:     20,
    paddingBottom: 5,
    height:        175,
  },
  container: {
    flex:          1,
    shadowColor:   'black',
    shadowOpacity: 0.05,
    shadowOffset:  {
      width:  0,
      height: 1,
    },
    shadowRadius: 3,
    elevation:    2,
    // borderRadius: 2,    backgroundColor:  'white',
    // height: 30,
    // marginHorizontal: 40
    // textContainer:
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
    fontFamily: 'open-sans',
    fontSize:   20,
    fontWeight: '500',
    textAlign:  'center',
  },
})
export default CategoryGridTile
