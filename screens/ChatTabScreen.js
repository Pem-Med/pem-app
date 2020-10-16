import React, { Component, useLayoutEffect } from 'react';
import { View, Button, Alert, Text, StyleSheet, Platform, FlatList, Image } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import Chat from '../components/Chat';
import Chatroom from '../screens/ChatroomScreen';
import * as firebase from 'firebase'
import 'firebase/firestore';
import Firebase from '../backend/firebase'
import Colors from '../constants/Colors';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {color} from '../utility/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SignOut from '../screens/SignOut';
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

        headerRight: ()=>(
            <SimpleLineIcon name ="logout" size={20} color={Colors.googleBlue}
            onPress={() =>
                Alert.alert(
                    'Log out',
                    'Do you want to logout?',
                    [
                        { text: 'Cancel', onPress: () => { return null } },
                        {
                            text: 'Confirm', onPress: () => {
                                new SignOut().signOut(props)
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <MaterialCommunityIcons name="exit-to-app" size={23} style={{ color: Colors.primary }}></MaterialCommunityIcons>
                <Text style={[styles.signText, { color: Colors.primary }]} > Logout</Text>
            </View>
            </SimpleLineIcon>

        )

    }
};

export default ChatTabScreen;