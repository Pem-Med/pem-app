import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import * as firebase from 'firebase';
import { List, Divider } from 'react-native-paper';

import Loading from '../../components/Loading';

export default AddPrivateChatScreen = props => {
    const db = firebase.database()
    const usersRef = db.ref('/users');

    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //get the list of all users
        usersRef.once("value", function (snapshot) {
            const data = snapshot.val();
            const loadedUsers = [];
            //transform the objects into array
            for (const key in data) {
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
    }, [setLoading, setUsersList]);

    if (loading) {
        return <Loading />
    }

    const getProfileImage = ({ avatar }) => {
        return avatar !== '' ? { uri: avatar } : require('../../components/img/default-profile-pic.jpg')
    }

    const getStatus = ({ status }) => {
        if (status === 'Active') {
            return '#34FFB9';
        } else if (status === 'Busy') {
            return 'red';
        }else{
            return 'grey';
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
                        onPress={() => { }}
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