import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as firebase from 'firebase';

import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import Loading from '../../components/Loading';


export default function AddRoomScreen({ navigation }) {
  const uid = firebase.auth().currentUser.uid;
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  function handleButtonPress() {
    setLoading(true);
    firebase.firestore()
      .collection('THREADS')
      .add({
        name: roomName,
        description: description,
        type: 'global',
        createdBy: uid
      })
      .then(() => {
        setLoading(false);
        navigation.navigate('Chat');
      })
      .catch((err) => {
        Alert.alert("Error", "There was an error creating the chat room. Please try again later.");
        setLoading(false);
      });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.rootContainer}>

      <View style={styles.inputsContainer}>
        <FormInput
          labelName='Room Name'
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
          clearButtonMode='while-editing'
          style={styles.inputs}
        />
        <FormInput
          labelName='Description'
          value={description}
          onChangeText={(text) => setDescription(text)}
          clearButtonMode='while-editing'
          multiline={true}
          numberOfLines={2}
          style={styles.inputs}

        />
        <FormButton
          title='Create'
          modeValue='contained'
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={roomName.length === 0 || description.length === 0}
          contentStyle={{ width: '100%' }}
          style={styles.inputs}
        />
      </View>
    </View>
  );
}

AddRoomScreen.navigationOptions = {
  title: 'Create Room'
};


const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  textContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginTop: 30
  },
  text: {
    fontSize: 18,
    fontFamily: 'helvetica'
  },
  inputsContainer: {
    width: '100%',
    padding: 20,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputs: {
    width: '85%',
    marginBottom: 30
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 20,
  },
});