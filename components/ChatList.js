import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { List, Divider } from 'react-native-paper';
import * as firebase from 'firebase';

import Loading from './Loading';

export default function ChatList({ navigation }) {

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //add a listener to the threads
    const unsubscribe = firebase.firestore()
      .collection('THREADS')
      .onSnapshot((querySnapshot) => {
        const loadedThreads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        setThreads(loadedThreads);
        setLoading(false);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        Alert.alert('Error', 'There was a problem loading the chats');
        setLoading(false);
      });


    //clean up listener
    return () => unsubscribe();
  }, [setLoading, setThreads]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {!threads || threads.length === 0 ?
        <View style={styles.textContainer}>
          <Text style={styles.text}>No Chats Available</Text>
        </View>
        :
        <FlatList
          data={threads}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', { thread: item })}
            >
              <List.Item
                title={item.name}
                description={item.description || 'Chat Room'}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  textContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 22
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});