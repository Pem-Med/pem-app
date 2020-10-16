import React, {
  Component, useCallback, useState, useEffect,
} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import * as Google from 'expo-google-app-auth'
import _ from 'lodash'
import Firebase from '../backend/firebase'
import Colors from '../constants/Colors'

function displayOKAlert(title, message) {
  Alert.alert(title, message)
}

const Login = (props) => {
  /**
   * Logs a user in with the specified username and password. This also increments
   * userCount, adds the username to the onlineUsers list, and sends them to the
   * Chatroom & CME screen.
   * @param {string} email
   * @param {string} password
   * @param {Object} props
   */

  const [showLoginScreen, setShowLoginScreen] = useState(false)
  const [disabledLoginButton, setDisabledLoginButton] = useState(false)
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  })

  useEffect(() => {
    if (showLoginScreen) { setDisabledLoginButton(!userInfo.password || !userInfo.username) }
    console.log('userInfo', userInfo)
  }, [userInfo])

  function logUserIn(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Firebase.shared.setUserCount = 1
        Firebase.shared.addOnlineUser(email)
        props.navigation.navigate({ routeName: 'Categories' })
      })
      .catch((err) => {
        if (email.length === 0 || password.length === 0) { displayOKAlert('You have to fill both fields 🧐') } else displayOKAlert('Wrong credentials', 'Try again 🧐')
        console.log(err)
      })
  }

  const loginWithGoogle = async function () {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          '692901117220-9chumnlmcfdbtuu7j94sfk61c5mnliom.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      })
      console.log(result)
      if (result.type === 'success') {
        const { idToken, accessToken } = result
        const credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken,
        )
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then((userInfo) => {
            firebase
              .database()
              .ref(`/users/${userInfo.user.uid}`)
              .equalTo(userInfo.user.email)
              .once('value')
              .then((snapshot) => {
                if (!snapshot.val()) {
                  const userRef = firebase
                    .database()
                    .ref(`/users/${userInfo.user.uid}`)
                  userRef.update({
                    profile: {
                      name:      userInfo.user.displayName,
                      email:     userInfo.user.email,
                      number:    '(###) ###-####',
                      avatar:    '',
                      title:     'Job Title',
                      status:    'Active',
                      certs:     '',
                      isVisible: false,
                    },
                  })
                  console.log('Profile has been created')
                }
              })
            alert(`Welcome ${userInfo.user.displayName}`)
            props.navigation.navigate({ routeName: 'Categories' })
          })
          .catch((error) => {
            console.log('firebase cred err:', error)
          })
      } else {
        return { cancelled: true }
      }
    } catch (err) {
      console.log('err:', err)
    }
  }

  const loginScreenHandler = () => {
    if (showLoginScreen) logUserIn(userInfo.username, userInfo.password)
    else {
      setShowLoginScreen(true)
      setDisabledLoginButton(true)
    }
  }

  // console.log(
  //   userInfo.password > 0 && userInfo.username.length > 0
  // );
  console.log('password', userInfo.password)
  console.log('username', userInfo.username)

  return (
    <KeyboardAvoidingView
      /* styles={styles.container} contentContainerStyle={styles.container} */ behavior={'position'}
      enabled
      keyboardVerticalOffset={'100'}
    >
      <View>
        <Image style={styles.logo} source={require('../data/logo.png')} />
      </View>
      <View styles={styles.view}>
        {showLoginScreen && (
          <>
            <TextInput
              style={[styles.textField, styles.email]}
              placeholder={'Enter your email'}
              onChangeText={(text) => {
                // if (userInfo.password && userInfo.username)
                //   setDisabledLoginButton(false);
                setUserInfo({ ...userInfo, username: text })
                // if (userInfo.password === "" || text === "")
                //   setDisabledLoginButton(true);
                console.log(userInfo.password)
                console.log(userInfo.username)
                console.log('text', userInfo.username)
                console.log('psize', _.size(userInfo.password))
                console.log('usize', _.size(userInfo.username))
              }}
              autoCapitalize={'none'}
            />
            <TextInput
              secureTextEntry
              style={styles.textField}
              placeholder={'Enter your password'}
              onChangeText={(text) => {
                // if (userInfo.password && userInfo.username)
                //   setDisabledLoginButton(false);
                setUserInfo({ ...userInfo, password: text })
                // if (text === "" || userInfo.username === "")
                //   setDisabledLoginButton(true);
                console.log(userInfo.password)
                console.log(userInfo.username)
                console.log('psize', _.size(userInfo.password))
                console.log('usize', _.size(userInfo.username))
              }}
            />
          </>
        )}
        <TouchableOpacity
          style={
            disabledLoginButton
              ? styles.disabledLoginButton
              : styles.loginButton
          }
          onPress={loginScreenHandler}
          disabled={disabledLoginButton}
        >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
        {showLoginScreen && (
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => loginWithGoogle()}
          >
            <Text style={styles.loginText}>Sign in with Google</Text>
          </TouchableOpacity>
        )}
        {!showLoginScreen && (
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              props.navigation.navigate('SignUp')
            }}
          >
            <Text style={styles.text}>Sign Up</Text>
          </TouchableOpacity>
        )}
        {showLoginScreen && (
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              setShowLoginScreen(false)
              setDisabledLoginButton(false)
            }}
          >
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const screenHeight = Math.round(Dimensions.get('window').height)
const screenWidth = Math.round(Dimensions.get('window').width)

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
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
  email: {
    marginBottom: 30,
    marginTop:    screenHeight * 0.1,
  },
  loginButton: {
    marginTop:       20,
    alignSelf:       'center',
    padding:         10,
    width:           250,
    backgroundColor: Colors.primaryColor,
    borderRadius:    25,
  },
  disabledLoginButton: {
    marginTop:       20,
    alignSelf:       'center',
    padding:         10,
    width:           250,
    backgroundColor: Colors.grayedOut,
    borderRadius:    25,
  },
  googleButton: {
    marginTop:       20,
    alignSelf:       'center',
    padding:         10,
    // width: '50%',
    backgroundColor: Colors.googleBlue,
    borderRadius:    25,
    width:           250,
  },
  signUpButton: {
    marginTop:    20,
    borderColor:  Colors.primaryColor,
    color:        Colors.primaryColor,
    borderWidth:  1,
    alignSelf:    'center',
    padding:      10,
    width:        250,
    borderRadius: 25,
  },
  text: {
    fontFamily: 'open-sans-bold',
    textAlign:  'center',
    color:      Colors.primaryColor,
  },
  loginText: {
    fontFamily: 'open-sans-bold',
    textAlign:  'center',
    color:      Colors.androidCustomWhite,
  },
  view: {
    justifyContent: 'center',
    alignItems:     'center',
    flexDirection:  'column',
  },
  logo: {
    width:      250,
    height:     150,
    resizeMode: 'stretch',
    alignSelf:  'center',
    marginTop:  40,
    marginLeft: 30,
  },
})

export default Login
