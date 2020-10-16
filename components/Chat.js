import React from 'react';
import {View, Text} from 'react-native';

const Dashboard = () => {
  return (
    <View>
      <Text>Chat</Text>
    </View>
  );
};

export default Dashboard;


// import React from 'react';
// import { TouchableOpacity, View, Text, StyleSheet, Platform, TouchableNativeFeedback, Image} from 'react-native';
// import 'firebase/firestore';
// import * as firebase from 'firebase';
// import Firebase from '../backend/firebase';
// import { testMatrix } from '../node_modules/firebase-functions/lib/providers/testLab';

// /*
// This is the component used to show an existing chat, it (ideally) takes the information from firebase as part of its props
// so that it can display information dynamically. Right now, it only takes information from the global chat, so the first thing 
// to do would be to make it accept a prop that determines which chat to use.

// Here are some features that I thought would be nice to have, but that I have not been able to implement yet.
//     - The ability to see the last message sent per chat
//     - Be able to start a new chat between two or more users.
// */
// const Chat = props => {
//     let TouchableCmp = TouchableOpacity;
//     if (Platform.OS === 'android' && Platform.Version >= 21) {
//         TouchableCmp = TouchableNativeFeedback;
//     }
//     let lastMessage = "default text"
//     let lastUsername = "aaa@aaaa"
    
//     return (
//         <View> 
//             <TouchableCmp onPress={ function () {
//                 props.navigation.navigate('Chatroom', { name: firebase.auth().currentUser.email })
//             }}>
//                 <View>
//                     <View style={styles.chatTile}>
//                         <Text style={styles.textStyle}>Go to Global Chat</Text>
//                     </View>
//                 </View>
//             </TouchableCmp>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     logo: {
//         width: 50,
//         height: 50,
//     },
//     chatTile: {
//         flexDirection: "row",
//     },
//     textStyle: {
//         fontSize: 30,
//     }
// })
// export default Chat;