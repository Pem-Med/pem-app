
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Button, Alert } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Firebase from '../backend/firebase';
import Login from '../screens/LoginScreen';
import { func } from 'prop-types';

function deleteAllMessages() {
    firebase.database().ref('userCount').on('value', function (snapshot) {
        if (snapshot.val().count == 0) {
            firebase.database().ref('messages').remove();
        }
    });
}

class SignOut extends Component {
    state = {
        messages: [],
        // onlineUsers: ''
    };

    displayOKAlert = (title, message) => {
        Alert.alert(
            title,
            message
        );
    }

    componentDidMount() {
        Firebase.shared.on(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        );
    }

    signOut = (props) => {
        let signOutUser = Firebase.shared.userEmail;
        firebase.auth().signOut().then(function () {
            Firebase.shared.setUserCount = -1;
            Firebase.shared.removeOnlineUser(signOutUser)
            firebase.database().ref('userCount').on('value', function (snapshot) {
                if (snapshot.val().count <= 0) {
                    deleteAllMessages()
                }
            })
            props.navigation.navigate('Login')
        }).catch(function (err) {
            this.displayOKAlert('Oh no!', 'Sign out failed: ' + err, false)
            console.log(err)
        });
    }

    componentWillUnmount() {
        Firebase.shared.off();
    }
};

export default SignOut;