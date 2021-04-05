import React, { Component } from 'react'
import {
  Alert,
} from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import Firebase from '../backend/firebase'

class SignOut extends Component {
    displayOKAlert = (title, message) => {
      Alert.alert(
        title,
        message,
      )
    }

    signOut = (props) => {
      const signOutUser = Firebase.shared.userEmail
      firebase.auth().signOut().then(() => {
        Firebase.shared.setUserCount = -1
        props.navigation.navigate('Login')
      }).catch(function (err) {
        this.displayOKAlert('Oh no!', `Sign out failed: ${err}`, false)
        console.log(err)
      })
    }
}

export default SignOut
