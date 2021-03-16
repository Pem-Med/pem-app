import {List} from 'react-native-paper';
import React, { useState } from "react";
import Highlight from "./Highlight";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    title: {
        color: "black",
        fontWeight: "bold",
        textTransform: 'capitalize'
    },
    description: {
        textTransform: 'capitalize'
    },
    content: {
        textTransform: 'capitalize'
    }
    
    
})

export default function CustomAccordionList({item, section}) {
    const [expanded, setExpanded] = useState(false);

    const handleOnPress = () => setExpanded(!expanded)

    return (
        <List.Accordion
            title={section}
            titleStyle={styles.title}
            expanded={expanded}
            onPress={handleOnPress}
            description={
              expanded ? (
                <Text></Text>
              ) : (
                <Highlight
                  attribute={section}
                  hit={item}
                  highlightProperty="_highlightResult"
                />
              )
            }
            descriptionNumberOfLines={1}
            descriptionStyle={styles.description}
          >
              <Text style={styles.content}>
            <Highlight
              attribute={section}
              hit={item}
              highlightProperty="_highlightResult"
            />
            </Text>
          </List.Accordion>
    )


}


