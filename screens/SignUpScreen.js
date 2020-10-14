import React, {
  Component, useState, useCallback, useEffect,
} from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet, View, TextInput, TouchableOpacity, Text, Alert,
} from 'react-native'
import UserPermission from '../utilities/UserPermission'
import * as firebase from 'firebase'
import 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import { firebrick } from 'color-name'
import Colors from '../constants/Colors'

/**
 * Displays an alert box with the specified title
 * and message.
 * @param {string} title
 * @param {string} message
 */

function displayOKAlert(title, message) {
  Alert.alert(
    title,
    message,
  )
}

const CreateAccount = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null)

  const clearTextInputs = () => {
    setDisplayName({ displayName: '' }),
    setEmail({ email: '' }),
    setPassword({ password: '' })
  }
  /*
    const saveInfo = (userCredentials) => {
      if (userCredentials.user) {
        console.log('Sign up user:' + userCredentials.user.uid);
        useCallback(() => {
        dispatch(UserProfileActions.createProfile(userCredentials.user.uid, displayName, email, '', 'homeless', '', '', '', false));
        }, [dispatch, userCredentials.user.uid, displayName, email]);}
      }
  */
  /**
   * Creates an account with the specified username and password. If it works,
   * an alert box is displayed, the user is brought to the Login page, and the
   * user is signed out (because creating an account automatically signs the user
   * in). If it fails, an alert box is shown notifying the user of the error.
   * @param {string} displayName
   * @param {string} email
   * @param {string} password
   */

  const db = firebase.firestore()

  const createUserAccount = (email, password, displayName) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const { currentUser } = firebase.auth()
        firebase
          .database()
          .ref(`/users/${currentUser.uid}/`)
          .set({
            profile: {
              name:      displayName,
              email,
              number:    '(###) ###-####',
              avatar:    '',
              title:     'Job Title',
              status:    'Active',
              certs:     '',
              isVisible: false,
            },
          })
      }).then(
        () => {
          displayOKAlert('Success!', 'Your account has been created'),
          props.navigation.replace('Login')
          firebase
            .auth()
            .signOut()
            .then(
              () => {
                console.log('User has been signed out')
              }).catch((err) => {
              console.log('An error has occured in createUserAccount signOut: ',
                err,
                // '\nF:', fullname,
                '\nU:', username,
                '| P:', password)
            })
        })
      .catch((err) => {
        displayOKAlert('Oh no!', (`${err}`).substring(7))
        console.log('An error has occured when creating your account: ',
          err,
          '\nU:', email,
          '| P:', password)
      })
    clearTextInputs()
  }

  /*
  export default class CreateAccount extends Component {

    static navigationOptions = {
      title: 'Sign Up',
    };

    constructor(props) {
      super(props)
      this.state = {
        fullName: "",
        username: "",
        password: "",
      }
      this.handleFullName = this.handleFullName.bind(this)
      this.handleEmail = this.handleEmail.bind(this)
      this.handlePassword = this.handlePassword.bind(this)
    }
    handleFullName(text) {
      this.setState({ fullName: text })
    }

    handleEmail(text) {
      this.setState({ username: text })
    }

    handlePassword(text) {
      this.setState({ password: text })
    }

    /**
     * Clears the text inputs. This is so that if there's an error,
     * the user doesn't have to backspace everything they put.
     */
  /*
  clearTextInputs() {
    this.setState({ fullname: "", username: "", password: "" })
  }

  /**
   * Creates an account with the specified username and password. If it works,
   * an alert box is displayed, the user is brought to the Login page, and the
   * user is signed out (because creating an account automatically signs the user
   * in). If it fails, an alert box is shown notifying the user of the error.
   * @param {string} fullname
   * @param {string} username
   * @param {string} password
   * @param {Object} props
   */

  /*
    createUserAccount(username, password, fullname, props) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(username, password)
        .then(
          function () {
            displayOKAlert('Success!', 'Your account has been created'),
              props.navigation.replace('Login')
            firebase
              .auth()
              .signOut()
              .then(
                function () {
                  console.log('User has been signed out')
                }).catch(function (err) {
                  console.log('An error has occured in createUserAccount signOut: ',
                    err,
                    //'\nF:', fullname,
                    '\nU:', username,
                    '| P:', password);
                })
          }).catch(function (err) {
            displayOKAlert('Oh no!', (err + "").substring(7))
            console.log('An error has occured in createUserAccount createUserWithEmailAndPassword: ',
              err,
              '\nU:', username,
              '| P:', password);
          })
      this.clearTextInputs()
    } */
  // uri: this.state.user.avatar
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textField, styles.fullName]}
        placeholder={'Enter your name'}
        onChangeText={(text) => setDisplayName(text)}
        value={displayName}
      />
      <TextInput
        style={[styles.textField, styles.email]}
        placeholder={'Enter your email'}
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize={'none'}
      />
      <TextInput
        secureTextEntry
        style={styles.textField}
        placeholder={'Password (At least 6 characters)'}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          createUserAccount(email, password, displayName)
        }}
      >
        <Text style={styles.text}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          props.navigation.navigate('Login')
        }}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  profileImage: {
    borderColor:  'gray',
    borderRadius: 80,
    borderWidth:  2,
    height:       160,
    marginBottom: 30,
    width:        160,
  },

  // textField: {
  //   fontFamily: 'open-sans-bold',
  //   height: 60,
  //   width: '80%',
  //   textAlign: 'center',
  //   borderColor: 'gray',
  //   borderWidth: 2,
  //   borderRadius: 30
  // },
  textField: {
    fontFamily:        'open-sans-bold',
    height:            50,
    width:             '60%',
    textAlign:         'center',
    alignSelf:         'center',
    borderBottomColor: 'gray',
    // borderColor: 'gray',
    borderBottomWidth: 1,
    // borderRadius: 25,
  },
  fullName: {
    marginBottom: 30,
  },
  email: {
    marginBottom: '6%',
  },
  button: {
    backgroundColor: Colors.primaryColor,
    borderRadius:    30,
    marginTop:       20,
    padding:         10,
    width:           250,
  },
  cancelButton: {
    borderColor:  Colors.primaryColor,
    borderRadius: 30,
    borderWidth:  1,
    marginTop:    20,
    padding:      10,
    width:        250,
  },
  text: {
    fontFamily: 'open-sans-bold',
    textAlign:  'center',
    color:      Colors.androidCustomWhite,
  },
  cancelText: {
    fontFamily: 'open-sans-bold',
    textAlign:  'center',
    color:      Colors.primaryColor,
  },
})

export default CreateAccount
