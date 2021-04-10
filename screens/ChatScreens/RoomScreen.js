import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, Alert, Platform, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as firebase from 'firebase';

import Loading from '../../components/Loading';
import Colors from '../../constants/Colors';


// resources used for using gifted chat: https://heartbeat.fritz.ai/chat-app-with-react-native-part-1-build-reusable-ui-form-elements-using-react-native-paper-75d82e2ca94f

export default function ChatRoomScreen(props) {
  //firebase 
  const uid = firebase.auth().currentUser.uid;
  const db = firebase.database();
  const userRef = db.ref(`users/${uid}/profile`);

  //components stuff
  const threadId = props.navigation.getParam('threadId');
  const originalThreadName = props.navigation.getParam('threadName');
  const usersList = props.navigation.getParam('usersList');
  const [threadName, setThreadName] = useState(originalThreadName);
  const [currentUser, setCurrentUser] = useState({});
  const [messages, setMessages] = useState([
    // system message
    {
      _id: 0,
      text: 'Reminder: Please follow HIPAA regulations.',
      system: true
    }
  ]);
  const [loading, setLoading] = useState(true);

  //this is code to fix disappearing textbox on ios
  const [bottomOffset, setBottomOffset] = useState(0)
  const wrapper = useRef()
  const handleLayout = useCallback(() => {
    if (Platform.OS === 'android') {
      return;
    }
    wrapper.current && wrapper.current.measureInWindow((_x, y, _width, height) => {
      const nextBottomOffset = Dimensions.get('window').height - y - height
      setBottomOffset(nextBottomOffset)
    })
  }, [])

  const getThreadName = (members) => {
    let name;
    
    if(members.length === 1){
      return usersList.find((user) => user._id === members[0]).name;
    }

    const otherUserId = members.filter((userId) => userId !== uid)[0];
    name = usersList.find((user) => user._id === otherUserId).name

    if (members.length === 2) {
      return name;
    }

    return `${name} +${members.length - 2} others`;
  };


  //get user info
  useEffect(() => {
    userRef.once(
      'value',
      (snapshot) => {
        setCurrentUser(snapshot.val());
      },
      (err) => {
        console.log("The read failed: " + err.code);
        Alert.alert('Error', 'There was a problem loading user info');
        props.navigation.goBack();
      },
    );
  }, [setCurrentUser]);

  useEffect(() => {
    props.navigation.setParams({ getName: threadName })
  }, [threadName]);

  //add listener for thread name, name can change when users are added/delete for private chat
  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('THREADS')
      .doc(threadId)
      .onSnapshot((documentSnapshot) => {
        const data = documentSnapshot.data();
        let loadedThread = {};

        loadedThread = {
          _id: documentSnapshot.id,
          ...data,
        };

        if (loadedThread.type === 'private') {
          const name = getThreadName(loadedThread.members);
          setThreadName(name);
        } else {
          setThreadName(loadedThread.name);
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        Alert.alert('Error', 'There was a problem loading the chat details');
      });


    //clean up listener
    return () => unsubscribe();
  }, []);

  //Load messages
  useEffect(() => {
    const messagesListener = firebase.firestore()
      .collection('MESSAGE')
      .doc(threadId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const loadedMessages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            ...firebaseData,
          };

          if (firebaseData.createdAt) {
            //convert timestamp to date object
            data.createdAt = firebaseData.createdAt.toDate();
          } else {
            //timestamp will be null the first time listener returns, this takes care of that
            data.createdAt = Date.now();
          }

          return data;
        });

        //disclaimer message goes first
        setMessages([...loadedMessages, messages[0]]);
        setLoading(false);
      });

    //clean up listener
    return () => messagesListener();
  }, []);

  // helper method that sends a message
  function handleSend(newMessages = []) {
    const text = newMessages[0].text;
    const user = newMessages[0].user;

    firebase.firestore()
      .collection('MESSAGE')
      .doc(threadId)
      .collection('messages')
      .add({
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        user: user
      })
      .catch(err => {
        Alert.alert('Error', 'There was an error sending the message, try again later.');
      });
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: Colors.chatPurple
          },
          left: {
            backgroundColor: Colors.white
          }
        }}
        textStyle={{
          right: {
            color: Colors.white
          }
        }}
      />
    );
  }

  //render send button
  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color={Colors.chatPurple} />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color={Colors.chatPurple} />
      </View>
    );
  }

  //for styling disclaimer message
  function renderSystemMessage(props) {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <SystemMessage
          {...props}
          containerStyle={{
            marginBottom: 15,
            backgroundColor: Colors.systemMessage,
            width: '50%',
            padding: 10,
            borderRadius: 5
          }}
          textStyle={{
            fontSize: 14,
            textAlign: 'center',
            color: 'black'
          }}
        />
      </View>
    )
  }

  function onAvatarClicked(user) {
    props.navigation.navigate('UserProfileScreen', { ID: user._id });
  }

  if (loading) {
    return <Loading />
  }

  return (
    <View style={{ flex: 1 }} onLayout={handleLayout} ref={wrapper}>
      <GiftedChat
        messages={messages}
        bottomOffset={Platform.OS === 'ios' ? bottomOffset : null}
        onSend={newMessage => handleSend(newMessage)}
        user={{ _id: uid, name: currentUser.name, avatar: currentUser.avatar }}
        renderBubble={renderBubble}
        placeholder='Type your message here...'
        showUserAvatar
        onPressAvatar={onAvatarClicked}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderSystemMessage={renderSystemMessage}
      />
    </View>
  );
}

ChatRoomScreen.navigationOptions = (navigationData) => {
  const threadId = navigationData.navigation.getParam('threadId');
  const originalThreadName = navigationData.navigation.getParam('threadName');
  const dynamicThreadName = navigationData.navigation.getParam('getName');

  return {
    title: dynamicThreadName || originalThreadName,
    headerRight: () => (
      <IconButton
        icon='information-outline'
        size={28}
        color={Platform.OS === 'android' ? Colors.white : Colors.primaryColor}
        onPress={() => navigationData.navigation.navigate('ChatDetail', { threadId: threadId })}
      />
    )
  }
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});





