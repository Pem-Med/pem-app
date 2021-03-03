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
    const [usersList, setUsersList] = useState(initialList);
    const [loading, setLoading] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);

    useEffect(() => {
        //unselect all users so that next time this component shows, it is reset.
        //called when the component unmounts
        return function cleanup() {
            initialList.map(user => {
                delete user.selected;
                return user;
            })
        }
    }, []);

    // const checkGroupExisting = () => {
    //     const groupRef = firebase.firestore().collection('THREADS')
    //     groupRef
    //         .where('members', 'array-contains', uid)
    //         .onSnapshot((querySnapshot) => {
    //             const allGroups = []
    //             querySnapshot.forEach((doc) => {
    //                 const data = doc.data()
    //                 data.id = doc.id
    //                 if (data.recentMessage) allGroups.push(data)
    //             })
    //             vm.groups = allGroups
    //         })
    // })


    const getThreadName = (selectedUsers) => {
        if (selectedUsers.length === 1) {
            return selectedUsers[0].name
        }

        const name = selectedUsers[0].name;
        return `${name} +${selectedUsers.length - 1} others`;
    };

    const handleUserPress = () => {
        setLoading(true);

        const selectedUsers = usersList.filter(user => user.selected === true);

        //TODO: check if this private chat between 2 people has already been created, if so navigate to it
        const members = selectedUsers.map(user => user._id);
        members.push(uid);

        firebase.firestore()
            .collection('THREADS')
            .add({
                description: 'Private Chat',
                type: 'private',
                members: members,
                createdAt: new Date().getTime(),
                createdBy: uid
            })
            .then((docRef) => {
                setLoading(false);
                const thread = {
                    _id: docRef.id,
                    name: getThreadName(selectedUsers)
                }
                props.navigation.navigate('Room', { thread: thread });
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Error", "There was an error creating the chat room. Please try again later.");
                setLoading(false);
            });
    };

    //set up handler for button on header to create chat
    const createHandler = useCallback(handleUserPress, []);

    useEffect(() => {
        props.navigation.setParams({ create: createHandler })
    }, [createHandler]);

    const onSelectUser = (selectedUser) => {
        const foundUser = usersList.find(user => user._id === selectedUser._id);
        if (foundUser.selected) {
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

    return (
        <View style={styles.screen}>
            <View style={styles.selectedCount}>
                <TouchableOpacity>
                    <Text>Selected: {selectedCount}</Text>
                </TouchableOpacity>
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