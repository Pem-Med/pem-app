import React from 'react';
import { Text } from 'react-native';
import { connectHighlight } from 'react-instantsearch-native';

export default connectHighlight(
  ({ highlight, attribute, hit, highlightProperty }) => {
    const parsedHit = highlight({ attribute, hit, highlightProperty });
    const highligtedHit = parsedHit.map((part, idx) => {
      //console.log("IDX: " + idx)
      //Object.values(part).map( (val, key) => console.log(key + ":" + val))
      if (part.isHighlighted) {
        return (
          <Text key={idx} style={{ backgroundColor: '#ffff99' }}>
            {part.value}
          </Text>
        );
      }

      return part.value
    });

    return <Text>{highligtedHit}</Text>;
  }
);