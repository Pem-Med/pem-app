import React,{useEffect, useState} from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import { List, Divider } from 'react-native-paper';

import Loading from '../../components/Loading';

export default AddPrivateChatScreen = props => {
    const db = firebase.database()
    const threadsRef = db.ref('/users');

    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //get the list of all users
        threadsRef.once("value", function (snapshot) {
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
            setLoading(false);
        });
    }, [setLoading, setUsersList]);

    if(loading){
        return <Loading/>
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={usersList}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {}}
                    >
                        <List.Item
                            title={item.name}
                            // description={item.description || 'Chat Room'}
                            titleNumberOfLines={1}
                            // titleStyle={styles.listTitle}
                            // descriptionStyle={styles.listDescription}
                            // descriptionNumberOfLines={1}
                        />
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
    }
});