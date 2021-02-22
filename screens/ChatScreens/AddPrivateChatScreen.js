import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import * as firebase from 'firebase';
import { Divider } from 'react-native-paper';

import Loading from '../../components/Loading';
import Colors from '../../constants/Colors';

// resource for creating private and group chats: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5 

export default AddPrivateChatScreen = props => {
    const uid = firebase.auth().currentUser.uid;
    const usersList = props.navigation.getParam('usersList');
    const [loading, setLoading] = useState(false);

    const handleUserPress = (selectedUser) => {
        setLoading(true);
        //TODO: check if this private chat between 2 people has already been created, if so navigate to it
        firebase.firestore()
            .collection('THREADS')
            .add({
                description: 'Private Chat',
                type: 'private',
                members: [uid, selectedUser._id],
                createdAt: new Date().getTime(),
                createdBy: uid       
            })
            .then((docRef) => {
                setLoading(false);
                const thread = {
                    _id: docRef.id,
                    name: selectedUser.name
                }
                props.navigation.navigate('Room', { thread: thread });
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "There was an error creating the chat room. Please try again later.");
                setLoading(false);
            });
    };

    if (loading) {
        return <Loading />
    }

    const getProfileImage = ({ avatar }) => {
        return avatar !== '' ? { uri: avatar } : require('../../components/img/default-profile-pic.jpg')
    }

    const getStatus = ({ status }) => {
        if (status === 'Active') {
            return Colors.active;
        } else if (status === 'Busy') {
            return Colors.busy;
        } else {
            return Colors.offline;
        }
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={usersList}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleUserPress(item)}
                    >
                        <View style={styles.itemContainer}>
                            <View>
                                <View style={styles.profileImage}>
                                    <Image source={getProfileImage(item)} style={styles.avatar} resizeMode={'cover'} width={40} height={40} />
                                </View>
                                <View>
                                    <View style={styles.active} backgroundColor={getStatus(item)} />
                                </View>
                            </View>
                            <Text style={styles.text}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
};

AddPrivateChatScreen.navigationOptions = {
    title: 'Choose User'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    text: {
        fontSize: 15
    },
    profileImage: {
        borderRadius: 100,
        overflow: 'hidden',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'white',
        marginRight: 15,
    },
    active: {
        position: 'absolute',
        bottom: 7,
        padding: 5,
        borderRadius: 25,
    },
});