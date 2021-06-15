import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

export default function AlphabeticalDivider(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text.charAt(0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grey,
    opacity: 0.7,
    flex: 1,
    height: 25,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
