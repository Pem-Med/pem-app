import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, FlatList, Image,
    TouchableOpacity, ImageBackground, Alert, ScrollView
} from 'react-native';
import { Divider } from 'react-native-paper';
import * as firebase from 'firebase';

import Colors from '../../constants/Colors';

const ChatDetailScreen = props => {
    const thread = props.navigation.getParam('thread');
    const isGlobal = thread.type === 'global';
    const db = firebase.database();
    const [users, setUsers] = useState([]);
    const [createdByName, setCreatedByName] = useState('');
    const canDelete = firebase.auth().currentUser.uid === thread.createdBy;

    //get users info for list
    useEffect(() => {
        if (!isGlobal) {
            fetchUsersByThread();
        } else {
            getCreatedByName();
        }
    }, [setUsers]);

    const fetchUsersByThread = () => {
        thread.users = [];
        const promises = [];
        //get user info for each user in the thread to display
        thread.members.forEach((userId) => {
            const promise = new Promise((resolve, reject) => {
                db.ref(`users/${userId}/profile`)
                    .once("value", function (snapshot) {
                        const user = snapshot.val();
                        user._id = userId;

                        if (thread.createdBy === userId) {
                            setCreatedByName(user.name);
                        }

                        resolve(user);
                    }, (err) => {
                        reject(err);
                    });
            });
            promises.push(promise);
        });

        Promise.all(promises)
            .then(loadedUsers => setUsers(loadedUsers))
            .catch(err => {
                console.log(err);
                Alert.alert("Error", "There was an error loading the users.");
            });
    };

    const getCreatedByName = () => {
        db.ref(`users/${thread.createdBy}/profile`)
            .once("value", function (snapshot) {
                const user = snapshot.val();
                setCreatedByName(user.name);
            }, (err) => {
                console.log(err);
                Alert.alert("Error", "There was an error loading created by name.");
            });
    };

    const getProfileImage = ({ avatar }) => {
        return avatar !== '' ? { uri: avatar } : require('../../components/img/default-profile-pic.jpg')
    };

    const onSelectUser = (user) => {
        props.navigation.navigate('UserProfileScreen', { ID: user._id });
    };

    const onDelete = () => {
        Alert.alert('Are you sure?', 'Are you sure you want to delete this chat?', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => console.log('to be deleted') }
        ]);
    };

    const renderUsersList = () => {
        return (
            <>
                <View style={[styles.headerContainer, styles.sectionsElevation]}>
                    <Text style={styles.headerText}>Users ({thread.members.length})</Text>
                </View>
                <View style={[styles.detailContainer, styles.sectionsElevation]}>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={() => <Divider />}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => onSelectUser(item)}
                            >
                                <View style={styles.userContainer}>
                                    <View>
                                        <View style={styles.profileImage}>
                                            <Image source={getProfileImage(item)} style={styles.avatar} resizeMode={'cover'} width={40} height={40} />
                                        </View>
                                    </View>
                                    <Text style={styles.userName}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </>
        );
    };


    return (
        <View style={styles.screen}>
            <ImageBackground
                source={require('../../components/img/colors3.jpeg')}
                style={styles.background}
            >
                <View style={styles.container}>
                    {/* General Info about the chat */}
                    <View style={[styles.headerContainer, styles.sectionsElevation]}>
                        <Text style={styles.headerText}>Info</Text>
                    </View>
                    <View style={[styles.detailContainer, styles.sectionsElevation]}>
                        <Text style={styles.detailText}>Type: {thread.type}</Text>
                        {isGlobal && <Text style={styles.detailText}>Name: {thread.name}</Text>}
                        {isGlobal && <Text style={styles.detailText}>Description: {thread.description}</Text>}
                        <Text style={styles.detailText}>Created By: {createdByName}</Text>
                    </View>

                    {/* Users listed if its a private chat */}
                    {!isGlobal && renderUsersList()}

                    {/* delete button visible to owner of chat */}
                    {canDelete &&
                        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ImageBackground>
        </View>
    );
};

ChatDetailScreen.navigationOptions = {
    title: 'Chat Info'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    background: {
        width: '100%',
        height: '100%',
    },
    container: {
        alignItems: 'center',
        marginTop: 20
    },
    headerContainer: {
        width: '85%',
        backgroundColor: Colors.white,
        padding: '3%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomColor: Colors.primaryColor,
        borderBottomWidth: 1
    },
    headerText: {
        fontSize: 17,
        color: Colors.primaryColor,
        fontWeight: 'bold',
        paddingLeft: 15
    },
    detailContainer: {
        backgroundColor: Colors.white,
        padding: '3%',
        width: '85%',
        maxHeight: 300,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 30
    },
    detailText: {
        fontSize: 17,
        padding: 3,
        paddingLeft: 15,
        fontFamily: 'open-sans',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    profileImage: {
        borderRadius: 100,
        overflow: 'hidden',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'white',
        marginRight: 15,
    },
    userName: {
        fontSize: 15
    },
    deleteButton: {
        width: '85%',
        backgroundColor: Colors.DeleteColor,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    deleteText: {
        color: Colors.white,
    },
    sectionsElevation: {
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 3,
    }
});

export default ChatDetailScreen;