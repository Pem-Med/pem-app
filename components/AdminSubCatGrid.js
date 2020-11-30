import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform, Image} from 'react-native';
import Colors from '../constants/Colors';

const AdminSubCatGrid = props => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  icon = require("../assets/icons/image-placeholder-icon-64.png")
  return (
      <View style={styles.screen}>
        <View style={{ ...styles.container, ...{ backgroundColor: Colors.white } }} >
          <View style={styles.touchable}>
            <TouchableCmp onPress={props.onSelect} useForeground>
              <View style={styles.infoContainer}>

                <View style={styles.textContainer} >
                  <Text style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <View style={styles.button}>
                    <Button
                        color={Colors.primaryColor}
                        title="Edit"
                        onPress={props.edit}
                    />
                  </View>
                  <View style={styles.button}>
                    <Button
                        color={Colors.DeleteColor}
                        title="Delete"
                        onPress={props.delete}
                    />
                  </View>
                  <Image source={icon}  style={styles.image}/>
                </View>
              </View>
            </TouchableCmp>
          </View>
        </View >
      </View>

  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.secondaryColor
  },
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: 'white',
    height: 100,
    margin: 40,
    marginVertical: 10,
  },
  touchable: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    width: '100%',
    height: '10%',
    alignItems: 'flex-start',
    marginLeft: '5%',
    paddingBottom: '20%'
  },
  image: {
    justifyContent: 'flex-start',
    height:50,
    width:50,
    resizeMode: 'contain',
    marginTop: 5,
    marginLeft: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 18,
    justifyContent: 'flex-end',
    marginVertical: 2,
    alignItems: 'flex-end',
    fontFamily: 'open-sans-bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: '30%',
    paddingBottom: '10%',
    marginLeft: '-1%',

  },
  button: {
    width: 70
  }

});
export default AdminSubCatGrid;
