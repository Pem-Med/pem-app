import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Title, List, Divider } from 'react-native-paper';
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
      for(const key in data){
        const newItem = {
          _id: key,
          name: data[key].name,
          // description: data[key].description
        }
        loadedThreads.push(newItem);
      }
      setThreads(loadedThreads);
      setLoading(false);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //clean up listener
    return ()=>  threadsRef.off('value', onValueChange);
  }, [setLoading,setThreads]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
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
              description='Item description'
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});