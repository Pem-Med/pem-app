import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { List, Divider } from 'react-native-paper';
import * as firebase from 'firebase';

import Loading from './Loading';

export default function ChatList({ navigation }) {
  const db = firebase.database()
  const threadsRef = db.ref('/threads');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //add a listener to the threads
    const onValueChange = threadsRef.on("value", function (snapshot) {
      const data = snapshot.val();
      const loadedThreads = [];
      for (const key in data) {
        const newItem = {
          _id: key,
          name: data[key].name,
          description: data[key].description
        }
        loadedThreads.push(newItem);
      }
      setThreads(loadedThreads);
      setLoading(false);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      Alert.alert('Error', 'There was a problem loading the chats');
      setLoading(false);
    });

    //clean up listener
    return () => threadsRef.off('value', onValueChange);
  }, [setLoading, setThreads]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {!threads || threads.length === 0 ?
        <View style={styles.textContainer}>
          <Text style={styles.text}>No Chats available</Text>
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
  textContainer:{
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  text:{
    fontSize:22
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});