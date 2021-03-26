import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, FlatList, Image,
    TouchableOpacity, ImageBackground, Alert, ScrollView
} from 'react-native';
import { Divider } from 'react-native-paper';
import * as firebase from 'firebase';
import Firebase from "../../backend/firebase";
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import Loading from '../../components/Loading';

const ChatDetailScreen = props => {
    const thread = props.navigation.getParam('thread');
    const isGlobal = thread.type === 'global';
    const currentUserId = firebase.auth().currentUser.uid;
    const isOwner = currentUserId === thread.createdBy;
    const db = firebase.database();
    const fb = Firebase.shared;

    const [users, setUsers] = useState([]);
    const [createdByName, setCreatedByName] = useState('');
    const [loading, setLoading] = useState(false);

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

    const deleteThread = () => {
        setLoading(true);

        //delete message subcollection first
        fb.deleteThreadMessagesSubCollection(thread._id, 500)
            .then(() => {
                //delete thread document
                firebase.firestore().collection('THREADS').doc(thread._id).delete();
            })
            .then(() => {
                setLoading(false);
                props.navigation.navigate('Chat');
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                Alert.alert("Error", "There was an error deleting this chat, try again later.");
            });
    };

    const onDelete = () => {
        Alert.alert('Are you sure?', 'Are you sure you want to delete this chat?', [
            { text: 'Cancel' },
            { text: 'Delete', style: 'destructive', onPress: deleteThread }
        ]);
    };

    const renderUsersList = () => {
        return (
            <>
                <View style={[styles.headerContainer, styles.sectionsElevation]}>
                    <View style={styles.userListHeader}>
                        <Text style={[styles.headerText, isOwner ? { width: '85%' } : {}]}>Users ({thread.members.length})</Text>
                        {isOwner &&
                            <TouchableOpacity style={styles.addUserBtn}>
                                <Ionicons name="md-person-add" size={24} color={Colors.greenAdd} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={[styles.detailContainer, styles.sectionsElevation]}>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={() => <Divider />}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                {/* User details */}
                                <TouchableOpacity
                                    onPress={() => onSelectUser(item)}
                                    style={[styles.userContainer, isOwner ? { width: '85%' } : {}]}
                                >
                                    <View>
                                        <View style={styles.profileImage}>
                                            <Image source={getProfileImage(item)} style={styles.avatar} resizeMode={'cover'} width={40} height={40} />
                                        </View>
                                    </View>
                                    <Text style={styles.userName}>{item.name}</Text>
                                </TouchableOpacity>

                                {/* Remove user button, current user cant remove themselves */}
                                {isOwner && item._id !== currentUserId &&
                                    <TouchableOpacity style={styles.removeUser}>
                                        <Ionicons name="md-remove-circle-outline" size={30} color={Colors.DeleteColor} />
                                    </TouchableOpacity>
                                }
                            </View>
                        )}
                    />
                </View>
            </>
        );
    };

    if (loading) {
        return <Loading />;
    }

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
                    {isOwner &&
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
    title: 'Chat Details'
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
        borderBottomWidth: 1,
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
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addUserBtn: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'15%'
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        overflow:'hidden'
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
    removeUser: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%'
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