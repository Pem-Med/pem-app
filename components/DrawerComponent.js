import React, { useEffect, useState } from 'react'
import {
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as firebase from 'firebase'
import Colors from '../constants/Colors'
import SignOut from '../screens/SignOut'

const DrawerComponent = (props) => {
  const user = firebase.auth().currentUser
  const db = firebase.database()
  const userRef = db.ref(`users/${user.uid}/profile`)

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [status, setStatus] = useState('')
  const [buttonColor, setButtonColor] = useState('')

  useEffect(() => {
    userRef.on('value', (snapshot) => {
      const { name, avatar, status } = snapshot.val()
      setName(name)
      setAvatar(avatar)
      setStatus(status)
    }, (err) => {
      console.log(`Encountered error: ${err}`)
    })
  }, [])

  useEffect(() => {
    if (status === 'Active') {
      setButtonColor('#34FFB9')
    } else if (status === 'Busy') {
      setButtonColor('red')
    }
  })

  const TouchableCmp = TouchableOpacity

  const image = !avatar ? require('./img/default-profile-pic.jpg') : { uri: avatar }
  // backgroundColor: Colors.primaryColor
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.padd}>
        <ScrollView>
          <View style={{ height: '46%' }}>
            <ImageBackground
              source={require('./img/colors0.jpeg')}
              style={{ width: '100%', height: '100%' }}
            >
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}>
                <Image source={image} style={styles.profileImage} />
                <TouchableCmp>
                  <View style={styles.active} backgroundColor={buttonColor} />
                </TouchableCmp>
                <Text style={[styles.signText, { marginTop: '2%' }]}>{name}</Text>
                <Text
                  style={{
                    color: 'black', fontFamily: 'open-sans', fontWeight: '200', fontSize: 14,
                  }}
                >
                  {user.email}
                </Text>
              </View>
            </ImageBackground>
          </View>

          <View style={{ marginTop: '2%' }}>
            <DrawerItems {...props} />
          </View>

        </ScrollView>
      </SafeAreaView>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => Alert.alert(
          'Log out',
          'Do you want to logout?',
          [
            { text: 'Cancel', onPress: () => null },
            {
              text:    'Confirm',
              onPress: () => {
                new SignOut().signOut(props)
              },
            },
          ],
          { cancelable: false },
        )}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <MaterialCommunityIcons name={'exit-to-app'} size={23} style={{ color: Colors.primary }} />
          <Text style={[styles.signText, { color: Colors.primary }]}> Logout</Text>
        </View>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  signText: {
    fontWeight: 'bold',
    fontSize:   16,
    color:      'black',
  },
  touchable: {
    position: 'absolute',
    bottom:   0,
    margin:   10,
  },
  container: {
    flex:       1,
    paddingTop: '10%',
  },
  profileImage: {
    height:       90,
    width:        90,
    aspectRatio:  1,
    overflow:     'hidden',
    borderRadius: 100,
    borderWidth:  2,
    borderColor:  'white',
  },
  active: {
    position:     'absolute',
    bottom:       12,
    padding:      9,
    borderRadius: 25,
    right:        '10%',
  },
})

export default DrawerComponent
