import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import Colors from "../constants/Colors";
import * as firebase from "firebase";

const ResetPasswordScreen = (props) => {
  const [email, setEmail] = useState("");
  //console.log("TEST OUTPUT -> " + email)

  const handleGoBack = () => {
    props.navigation.navigate("Login");
  };

  const handleForgotPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)

      .then((user) => {
        alert(
          "We have send a password reset link to " +
            email +
            ". If your email is valid, you should receive a link shortly. Please check your inbox."
        );
      })
      .catch((e) => {
        alert(e);
      });
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>Reset Your Password</Text>
      </View>
      <View style={styles.formWrapper}>
        <TextInput
          style={[styles.textField, styles.email]}
          placeholder="Enter Your email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={{ ...styles.button, ...styles.forgotPasswordBtn }}
          onPress={handleForgotPassword.bind(this)}
        >
          <Text style={styles.loginText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button, ...styles.backBtn }}
          onPress={handleGoBack}
        >
          <Text style={{ ...styles.loginText, ...styles.textCancel }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  text: { fontSize: 25, textAlign: "center", alignSelf: "center" },
  textField: {
    fontFamily: "open-sans-bold",
    height: 50,
    width: "60%",
    textAlign: "center",
    alignSelf: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    width: 250,
    borderRadius: 25,
  },
  backBtn: { borderColor: Colors.secondaryColor, borderWidth: 2 },
  forgotPasswordBtn: {
    backgroundColor: Colors.primaryColor,
  },
  loginText: {
    fontFamily: "open-sans-bold",
    textAlign: "center",
    color: Colors.androidCustomWhite,
  },
  textCancel: {
    color: Colors.secondaryColor,
  },
  textWrapper: { flex: 1, justifyContent: "center" },
  formWrapper: {
    flex: 2,
    justifyContent: "flex-start",
  },
});

export default ResetPasswordScreen;
