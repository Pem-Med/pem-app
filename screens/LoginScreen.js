import React, { Component, useCallback, useState, useEffect } from "react";
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
} from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import Firebase from "../backend/firebase";
import * as Google from "expo-google-app-auth";
import Colors from "../constants/Colors";
import _ from "lodash";
//import * as Facebook from "expo-facebook";

function displayOKAlert(title, message) {
  Alert.alert(title, message);
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

  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [disabledLoginButton, setDisabledLoginButton] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (showLoginScreen)
      setDisabledLoginButton(!userInfo.password || !userInfo.username);
  }, [userInfo]);

  // useEffect(() => {
  //   Facebook.initializeAsync("3384537118298352", "med-app");
  // }, []);

  function logUserIn(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        props.navigation.navigate({ routeName: "Categories" });
      })
      .catch(function (err) {
        console.log(err.code);
        if(err.code == "auth/invalid-email") {
          displayOKAlert("Please enter a valid email", "Example: example@example.com")
        } else if (email.length === 0 || password.length === 0)
          displayOKAlert("You have to fill both fields 🧐");
        else if (err.code == "auth/wrong-password") {
          displayOKAlert("Wrong credentials", "Try again 🧐")
        }
        else if (err.code == "auth/unknown") {
          displayOKAlert("Netowrk Error", "Please verify you have an active network connection!");
        } else {displayOKAlert("Unkwon Error", "An Unkown error has occurred please try again at another time. ")}
      });
  }

  const loginWithGoogle = async function () {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          "692901117220-9chumnlmcfdbtuu7j94sfk61c5mnliom.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });
      if (result.type === "success") {
        const { idToken, accessToken } = result;
        const credential = firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then((userInfo) => {
            firebase
              .database()
              .ref(`/users/${userInfo.user.uid}`)
              .equalTo(userInfo.user.email)
              .once("value")
              .then((snapshot) => {
                if (!snapshot.val()) {
                  const userRef = firebase
                    .database()
                    .ref(`/users/${userInfo.user.uid}`);
                  userRef.update({
                    profile: {
                      name: userInfo.user.displayName,
                      email: userInfo.user.email,
                      number: "(###) ###-####",
                      avatar: "",
                      title: "Job Title",
                      status: "Active",
                      isVisible: false,
                    },
                  });
                }
              });
            alert(`Welcome ${userInfo.user.displayName}`);
            props.navigation.navigate({ routeName: "Categories" });
          })
          .catch((error) => {
            console.log("firebase cred err:", error);
          });
      } else {
        return { cancelled: true };
      }
    } catch (err) {
      console.log("err:", err);
    }
  };
  // const loginWithFacebook= async () => {
  //   try {
  //     const {
  //       type,
  //       token,
  //       expires,
  //       permissions,
  //       declinedPermissions,
  //     } = await Facebook.logInWithReadPermissionsAsync('3384537118298352', {
  //       permissions: ['public_profile'],
  //     });
  //     if (type === 'success') {
  //       // Get the user's name using Facebook's Graph API
  //       fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
  //         .then(response => response.json())
  //         .then(data => {
  //           console.log(data)
  //           setLoggedinStatus(true);
  //           setUserInfo({
  //             username: data.email,
  //             password: "",
  //           });
  //         })
  //         .catch(e => console.log(e))
  //     } else {
  //       // type === 'cancel'
  //     }
  //   } catch ({ message }) {
  //     alert(`Facebook Login Error: ${message}`);
  //   }
  // }

  // logout = () => {
  //   setLoggedinStatus(false);
  //   setUserData(null);
  //   setImageLoadStatus(false);
  // }
  // export async function loginWithFacebook()

  // const loginWithFacebook = async () => {
  //   const appId = "3384537118298352";
  //   const permissions = ["public_profile", "email"]; // Permissions required, consult Facebook docs

  //   const { type, token } = await Facebook.logInWithReadPermissionsAsync(
  //     appId,
  //     { permissions }
  //   );

  //   switch (type) {
  //     case "success": {
  //       await firebase
  //         .auth()
  //         .setPersistence(firebase.auth.Auth.Persistence.LOCAL); // Set persistent auth state
  //       const credential = firebase.auth.FacebookAuthProvider.credential(token);
  //       const userInfo = await firebase.auth().signInWithCredential(credential);  // Sign in with Facebook credential
  //       firebase
  //       .database()
  //       .ref(`/users/${userInfo.user.uid}`)
  //       .equalTo(userInfo.user.email)
  //       .once("value")
  //       .then((snapshot) => {
  //         if (!snapshot.val()) {
  //           const userRef = firebase
  //             .database()
  //             .ref(`/users/${userInfo.user.uid}`);
  //           userRef.update({
  //             profile: {
  //               name: userInfo.user.displayName,
  //               email: userInfo.user.email,
  //               number: "(###) ###-####",
  //               avatar: "",
  //               title: "Job Title",
  //               status: "Active",
  //               certs: "",
  //               isVisible: false,
  //             },
  //           });
  //         }
  //       });
  //     alert(`Welcome ${userInfo.user.displayName}`);
  //     props.navigation.navigate({ routeName: "Categories" });
    
  //       // Do something with Facebook profile data
  //       // OR you have subscribed to auth state change, authStateChange handler will process the profile data

  //       return Promise.resolve({ type: "success" });
  //     }
  //     case "cancel": {
  //       return Promise.reject({ type: "cancel" });
  //     }
  //   }
  // };

  const loginScreenHandler = () => {
    if (showLoginScreen) logUserIn(userInfo.username, userInfo.password);
    else {
      setShowLoginScreen(true);
      setDisabledLoginButton(true);
    }
  };

  return (
    <KeyboardAvoidingView
      /* styles={styles.container} contentContainerStyle={styles.container} */ behavior="position"
      enabled
      keyboardVerticalOffset="100"
    >
      <View>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <View styles={styles.view}>
        {showLoginScreen && (
          <>
            <TextInput
              style={[styles.textField, styles.email]}
              placeholder="Enter your email"
              onChangeText={(text) => {
                if (userInfo.password && userInfo.username)
                  setDisabledLoginButton(false);
                setUserInfo({ ...userInfo, username: text });
              }}
              autoCapitalize="none"
            />
            <TextInput
              secureTextEntry
              style={styles.textField}
              placeholder="Enter your password"
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, password: text });
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

        {/*TODO:***************Forgot Password******************/}
        {showLoginScreen && (
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              props.navigation.navigate("ResetPassword");
            }}
          >
            <Text style={styles.loginText}>Forgot Password</Text>
          </TouchableOpacity>
        )}
        {/*TODO:*************** END Forgot Password******************/}
        {/* {showLoginScreen && (
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => loginWithGoogle()}
          >
            <Text style={styles.loginText}>Sign in with Google</Text>
          </TouchableOpacity>
        )} */}
        {/* {showLoginScreen && (
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => loginWithFacebook()}
          >
            <Text style={styles.loginText}>Log in with Facebook</Text>
          </TouchableOpacity>
        )} */}
        {!showLoginScreen && (
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              props.navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.text}>Sign Up</Text>
          </TouchableOpacity>
        )}
        {showLoginScreen && (
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              setShowLoginScreen(false);
              setDisabledLoginButton(false);
            }}
          >
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

let screenHeight = Math.round(Dimensions.get("window").height);
let screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
  textField: {
    fontFamily: "open-sans-bold",
    height: 50,
    width: "60%",
    textAlign: "center",
    alignSelf: "center",
    borderBottomColor: "gray",
    // borderColor: 'gray',
    borderBottomWidth: 1,
    // borderRadius: 25,
  },
  email: {
    marginBottom: 5,
    marginTop: screenHeight * 0.1,
  },
  loginButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    width: 250,
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
  },

  disabledLoginButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    width: 250,
    backgroundColor: Colors.grayedOut,
    borderRadius: 25,
  },
  forgotPassword: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    width: 250,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 25,
  },
  signUpButton: {
    marginTop: 20,
    borderColor: Colors.primaryColor,
    color: Colors.primaryColor,
    borderWidth: 1,
    alignSelf: "center",
    padding: 10,
    width: 250,
    borderRadius: 25,
  },
  text: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    color: Colors.primaryColor,
  },
  loginText: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    color: Colors.androidCustomWhite,
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 20,
  },
});

export default Login;
