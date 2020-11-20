import React, { Component } from 'react';
import { View, Button, Text, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import Chat from '../components/Chat';
import Chatroom from '../screens/ChatroomScreen';
import * as firebase from 'firebase'
import 'firebase/firestore';
import Firebase from '../backend/firebase'
import Colors from '../constants/Colors';
//import {HeaderButtons, Item } from 'react-navigation-header-buttons';
//import CustomHeaderButton from '../components/CustomHeaderButton';

/**
 * The ChatTabScreen component is the first thing in the hierarchy of the chat's functionality. It's the first thing 
 * a user sees when they click on the chat section, and is meant to display all the user's chats. 
 */
class ChatTabScreen extends Component {
    constructor(props) {
        super(props)        
    }
    
    render() {
        
        return (
            <View style={styles.screen}>
                <Chat navigation={this.props.navigation} ></Chat>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 5,
        paddingVertical: 5,
        backgroundColor: Colors.androidCustomWhite
    },
    buttons: {
        flex: 1,
        height: 2000
    },
    sep: {
        borderBottomColor: Colors.androidCustomWhite,
        borderBottomWidth: 15
    }
});


ChatTabScreen.navigationOptions = navigationData => {
    return {
            headerStyle: {
                backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white'
              
            },
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item title='Menu' iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),

    }
};

export default ChatTabScreen;