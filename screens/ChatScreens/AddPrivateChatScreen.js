import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import * as firebase from 'firebase';
import { Divider, IconButton } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';

import Loading from '../../components/Loading';
import Colors from '../../constants/Colors';

// resource for creating private and group chats: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5 

export default AddPrivateChatScreen = props => {
    const uid = firebase.auth().currentUser.uid;
    const initialList = props.navigation.getParam('usersList');
    const [usersList, setUsersList] = useState(initialList.filter(user => user.online === true));
    const [loading, setLoading] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        //unselect all users so that next time this component shows, it is reset.
        //called when the component unmounts
        return function cleanup() {
            usersList.map(user => {
                delete user.selected;
                return user;
            })
        }
    }, []);

    const getThreadName = (selectedUsers) => {
        if (selectedUsers.length === 1) {
            return selectedUsers[0].name
        }

        const name = selectedUsers[0].name;
        return `${name} +${selectedUsers.length - 1} others`;
    };

    //check if group exists, only for groups of 2
    const checkGroupExisting = async (selectedUser) => {
        const snapshot = await firebase.firestore().collection('THREADS')
            .where('members', 'in', [[uid, selectedUser._id], [selectedUser._id, uid]])
            .get();

        if (snapshot.empty) {
            return;
        } else {
            const thread = {
                _id: snapshot.docs[0].id,
                ...snapshot.docs[0].data(),
                name: getThreadName([selectedUser])
            };

            return thread;
        }
    };

    const onCreateHandler = async () => {
        const selectedUsers = usersList.filter(user => user.selected === true);
        setLoading(true);

        if (selectedUsers.length === 0) {
            Alert.alert('Sorry!', 'Please select at least one user.');
            setLoading(false);

            return;
        } else if (selectedUsers.length === 1) {
            //check if this private chat between 2 people has already been created, if so navigate to it
            const loadedThread = await checkGroupExisting(selectedUsers[0]);

            if (loadedThread) {
                setLoading(false);
                props.navigation.navigate('Room', { threadId: loadedThread._id, threadName: loadedThread.name, usersList: usersList });
                return;
            }
        }

        const members = selectedUsers.map(user => user._id);
        members.push(uid);

        let thread = {
            type: 'private',
            members: members,
            createdAt: new Date().getTime(),
            createdBy: uid
        };

        firebase.firestore()
            .collection('THREADS')
            .add(thread)
            .then((docRef) => {
                setLoading(false);
                thread._id = docRef.id;
                thread.name = getThreadName(selectedUsers);
                props.navigation.navigate('Room', { threadId: thread._id, threadName: thread.name, usersList: usersList });
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "There was an error creating the chat room. Please try again later.");
                setLoading(false);
            });
    };

    //set up handler for button on header to create chat
    const createHandler = useCallback(onCreateHandler, []);

    useEffect(() => {
        props.navigation.setParams({ create: createHandler })
    }, [createHandler]);

    const onSelectUser = (selectedUser) => {
        if (selectedUser.selected) {
            //unselect this user
            setUsersList(prevList => prevList.map(user => {
                if (user._id === selectedUser._id) {
                    user.selected = false;
                    return user;
                }
                return user;
            }));

            setSelectedCount(count => count - 1);
        } else {
            //select this user
            setUsersList(prevList => prevList.map(user => {
                if (user._id === selectedUser._id) {
                    user.selected = true;
                    return user;
                }
                return user;
            }));

            setSelectedCount(count => count + 1);
        }
    }

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

    if (usersList.length === 0) {
        return (
            <View style={styles.emptyTextContainer}>
                <Text style={styles.emptyText}>No users online, try again later!</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.selectedCount}>
                <Text>Selected: {selectedCount}</Text>
            </View>
            <FlatList
                data={usersList}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onSelectUser(item)}
                    >
                        <View style={styles.itemContainer}>
                            {item.selected
                                ?
                                <View style={styles.selectedUser}>
                                    <Entypo name="check" size={24} color={Colors.white} />
                                </View>
                                :
                                <View>
                                    <View style={styles.profileImage}>
                                        <Image source={getProfileImage(item)} style={styles.avatar} resizeMode={'cover'} width={40} height={40} />
                                    </View>
                                    <View>
                                        <View style={styles.active} backgroundColor={getStatus(item)} />
                                    </View>
                                </View>
                            }
                            <Text style={styles.text}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
};

AddPrivateChatScreen.navigationOptions = navigationData => {
    return {
        title: 'Select Users',
        headerRight: () => (
            <IconButton
                icon='check'
                size={28}
                color={Platform.OS === 'android' ? Colors.white : Colors.primaryColor}
                onPress={navigationData.navigation.getParam('create')}
            />
        )
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    emptyTextContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30
    },
    emptyText: {
        fontSize: 22,
        textAlign: 'center'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    selectedCount: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    text: {
        fontSize: 15
    },
    selectedUser: {
        borderRadius: 100,
        width: 40,
        height: 40,
        backgroundColor: Colors.primaryColor,
        aspectRatio: 1,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
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