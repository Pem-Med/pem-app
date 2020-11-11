import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';

import FormButton from '../components/FormButton';

export default function HomeScreen({ navigation }) {
  
  return (
    <View style={styles.container}>
      <Title>Chat Screen</Title>
      <Title>All chat rooms will be listed here</Title>
      
      
      
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