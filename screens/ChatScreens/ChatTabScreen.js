import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform, } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { IconButton } from 'react-native-paper';
import * as firebase from 'firebase';

import CustomHeaderButton from '../../components/CustomHeaderButton';
import ChatList from '../../components/ChatList';
import Colors from '../../constants/Colors';
import RadioModal from '../../components/RadioModal';
import Loading from '../../components/Loading';


/**
 * The ChatTabScreen component is the first thing in the hierarchy of the chat's functionality. It's the first thing 
 * a user sees when they click on the chat section, and is meant to display all the chat rooms
 */
const ChatTabScreen = (props) => {
    const usersRef = firebase.database().ref('/users');
    const uid = firebase.auth().currentUser.uid;
    const radioOptions = [
        { label: 'Global Room', value: 0 },
        { label: 'Private', value: 1 }
    ];
    
    const [modalVisible, setModalVisible] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(false);

    //set up listener for user profiles
    useEffect(() => {
        setLoading(true);
        const onValueChange = usersRef.on("value", function (snapshot) {
            const data = snapshot.val();
            const loadedUsers = [];
            //transform the objects into array
            for (const key in data) {
                if (uid === key) {
                    //exclude current user from the list
                    continue;
                }
                const profile = data[key].profile;
                const user = {
                    _id: key,
                    avatar: profile.avatar,
                    name: profile.name,
                    status: profile.status
                }
                loadedUsers.push(user);
            }

            //sort
            loadedUsers.sort(function (a, b) {
                let itemA = a.name.toUpperCase();
                let itemB = b.name.toUpperCase();
                return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0
            });

            //set the list
            setUsersList(loadedUsers);
            setLoading(false);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            Alert.alert('Error', 'There was a problem loading the users');
            props.navigation.goBack();
            setLoading(false);
        });

        //clean up listener
        return () => usersRef.off('value', onValueChange);

    }, [setLoading, setUsersList]);

    //set up handler for button on header to open the modal
    const createHandler = useCallback(() => {
        setModalVisible(true);
    }, [setModalVisible]);

    useEffect(() => {
        props.navigation.setParams({ create: createHandler })
    }, [createHandler]);

    const navigateToCreate = (selectedOption) => {
        setModalVisible(false);
        if (selectedOption == 0) {
            props.navigation.navigate('AddRoom');
        } else {
            props.navigation.navigate('AddPrivateChat', { usersList: usersList });
        }
    };

    if(loading){
        return <Loading/>
    }

    return (
        <View style={styles.screen}>
            <ChatList navigation={props.navigation} usersList={usersList} ></ChatList>
            <RadioModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                onSubmit={navigateToCreate}
                radioOptions={radioOptions}
                headerText={'Choose the type of chat:'}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
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

        headerRight: () => (
            <IconButton
                icon='message-plus'
                size={28}
                color={Platform.OS === 'android' ? Colors.white : Colors.primaryColor}
                onPress={navigationData.navigation.getParam('create')}
            />
        )
    }
};

export default ChatTabScreen;
