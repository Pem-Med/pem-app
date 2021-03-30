import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SectionList, TouchableOpacity, Text, Alert } from 'react-native';
import { List, Divider } from 'react-native-paper';
import * as firebase from 'firebase';

import Loading from './Loading';
import Colors from '../constants/Colors';

export default function ChatList(props) {
  const uid = firebase.auth().currentUser.uid;
  const usersList = props.usersList;

  const [threads, setThreads] = useState({ global: [], private: [] });
  const [loading, setLoading] = useState(true);

  const getThreadName = (members) => {
    const otherUserId = members.filter((userId) => userId !== uid)[0];
    const name = usersList.find((user) => user._id === otherUserId).name

    if (members.length === 2) {
      return name;
    }

    return `${name} +${members.length - 2} others`;
  };

  const transformLoadedData = (querySnapshot) => {
    const loadedThreads = querySnapshot.docs.map((documentSnapshot) => {
      const data = documentSnapshot.data();
      let thread = {};

      thread = {
        _id: documentSnapshot.id,
        ...data,
      };

      if (thread.type === 'private') {
        //set the thread name to the user you are messaging
        thread.name = getThreadName(thread.members);
      }

      return thread;
    });

    return loadedThreads;
  }

  //add a listener for private chats
  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('THREADS')
      .where('members', 'array-contains', uid)
      .onSnapshot((querySnapshot) => {
        const loadedThreads = transformLoadedData(querySnapshot);

        setThreads(prevState => {
          return { ...prevState, private: loadedThreads }
        });

        setLoading(false);

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        Alert.alert('Error', 'There was a problem loading the chats');
        setLoading(false);
      });


    //clean up listener
    return () => unsubscribe();
  }, [setLoading, setThreads]);

  //add a listener for global chats
  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('THREADS')
      .where('type', '==', 'global')
      .onSnapshot((querySnapshot) => {
        const loadedThreads = transformLoadedData(querySnapshot);

        setThreads(prevState => {
          return { ...prevState, global: loadedThreads }
        });

        setLoading(false);

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        Alert.alert('Error', 'There was a problem loading the chats');
        setLoading(false);
      });


    //clean up listener
    return () => unsubscribe();
  }, [setLoading, setThreads]);

  //created rounded corners for the section by modifiying individual item styles
  const getItemStyle = (index, section) => {
    const lastItem = section.data.length - 1;

    return {
      borderTopLeftRadius: index === 0 ? 10 : 0,
      borderTopRightRadius: index === 0 ? 10 : 0,
      borderBottomLeftRadius: index === lastItem ? 10 : 0,
      borderBottomRightRadius: index === lastItem ? 10 : 0,
      backgroundColor: Colors.white,
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {!threads || (threads.global.length === 0 && threads.private.length === 0) ?
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyText}>No Chats Available</Text>
        </View>
        :
        <SectionList
          ItemSeparatorComponent={() => <Divider />}
          keyExtractor={(item, index) => item._id}
          sections={[
            { title: 'Global Chats', data: threads.global },
            { title: 'Private Chats', data: threads.private },
          ]}
          renderSectionHeader={({ section }) => {
            if (section.data.length !== 0) {
              return (
                <Text style={styles.sectionHeaderStyle}>
                  {section.title}
                </Text>
              )
            }
          }}
          renderItem={({ item, section, index }) => {
            return (
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Room', { threadId: item._id , threadName: item.name, usersList: usersList})}
              >
                <List.Item
                  title={item.name}
                  description={item.description}
                  titleNumberOfLines={1}
                  titleStyle={styles.itemTitle}
                  descriptionStyle={styles.itemDescription}
                  descriptionNumberOfLines={1}
                  style={getItemStyle(index, section)}
                />
              </TouchableOpacity>
            )
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 5
  },
  emptyTextContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 22
  },
  itemTitle: {
    fontSize: 22
  },
  itemDescription: {
    fontSize: 16
  },
  sectionHeaderStyle: {
    fontSize: 15,
    color: Colors.lightGrey,
    paddingVertical: 5,
  },
});