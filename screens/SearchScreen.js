import React, { useState, Component } from 'react';
import {InstantSearch,
  connectSearchBox,
  connectStats,
  connectInfiniteHits

} from "react-instantsearch-dom";
import algoliasearch from 'algoliasearch/lite';
import Highlight from './Highlight';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import {Card} from 'react-native-paper';
import Colors from '../constants/Colors';
import algoliaConfig from '../algoliaConfig';



const  {height}  = Dimensions.get('window');
//TODO: Add 'Search results Provided by Algolia' as per Algolia free account requirements.
//Algolia Search, App ID and API Key (Search Only)
//All in one place, so no need to search for every place its used
const appID =  algoliaConfig.appID;
const apiKey = algoliaConfig.searchKey;


const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  items: {
    ...Platform.select({
      ios: {
        height: height - 100,
      },
      android: { height: height - 100},
    }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  searchBoxContainer: {
    alignContent: 'flex-end',
    backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,

  },
  searchBox: {
    backgroundColor: 'white',
    height: 40,
    borderWidth: 1,
    padding: 10,
    margin: 10,
    flexGrow: 1,
    ...Platform.select({
      ios: {
        borderRadius: 10,
      },
      android: {
        borderRadius: 10,
      },
    }),
  },
  itemContent: {
    paddingLeft: 15,
    display: 'flex',
    marginRight: 5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 5,
    textTransform: 'capitalize',
  },
  innerItem: {
    fontSize: 15,
    paddingBottom: 5,
    textTransform: 'capitalize',
  },
  button:{
    justifyContent:'flex-start',
    flexDirection:'column',
    textAlign:'right',
  },
});
const searchClient = algoliasearch(
  appID,
  apiKey
);

class SearchScreen extends Component {
 appID = appID;
 apiKey = apiKey;
 indexName = "med_Categories";

  constructor(props) {
    super(props);
    this.state = {
      searchState: this.props.searchState ? this.props.searchState : {},
    };
  }
  onSearchStateChange = nextState => {
    this.setState({ searchState: { ...this.state.searchState, ...nextState } });
  };

  navigateTo(subCatID) {
    this.props.navigate( {routeName: "CatContent",
    params: {
      subcategoryId: subCatID
    }});
  }
  
  

  render() {
    return (
      <View style={styles.maincontainer}>
          <InstantSearch searchClient={searchClient}
            appId={appID}
            apiKey={apiKey}
            indexName={this.indexName}>
            <ConnectedSearchBox />
            <View style={styles.options}>
            <ConnectedStats />
            </View>
            <ConnectedHits />
          </InstantSearch>
      </View>
    );
  }
}
SearchScreen.propTypes = {
  searchState: PropTypes.object,
};

export default SearchScreen;

class SearchBox extends Component {

  render() {
    return (
      <View style={styles.searchBoxContainer} >
        <TextInput
          style={styles.searchBox}
          onChangeText={text => this.props.refine(text)}
          value={this.props.currentRefinement}
          placeholder={'Search ...'}
          clearButtonMode={'always'}
          underlineColorAndroid={'white'}
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize={'sentences'}
        />
      </View>
    );
  }
}

SearchBox.propTypes = {
  refine: PropTypes.func.isRequired,
  currentRefinement: PropTypes.string,
};

const ConnectedSearchBox = connectSearchBox(SearchBox);


const routeToCat = ({subCatID}) => {
  var test = SearchScreen();
  console.log(test);
  navigator.navigate({
    routeName: "CatContent",
    params: {
      subcategoryId: subCatID
    }
  })
} 

class Hits extends Component {

  onEndReached = () => {
    if (this.props.hasMore) {
      this.props.refine();
    }
  };

  render() {
    const hits =
      this.props.hits.length > 0 ? (
        <View style={styles.items}>
          <FlatList keyExtractor={(hit) => hit.objectID} data={this.props.hits} renderItem={this._renderRow} />
        </View>
      ) : <Text> No Items Found </Text>;
    return hits;
  }

  /* Get the category based on the category id*/
  _getSubTitle = (cat) => {
    switch(cat) {
      case "c1": return "Medical";
      case "c2": return "Surgical";
      case "c3": return "Trauma";
      case "c4": return "Toxicology";
      case "c5": return "Foreign Ingestion";
  }
  }

  _renderRow = ({ item: hit }) => (
    //Create card with padding 10 all arround and elevation of 20
    //bg color is extracted from hit
    <View padding={10,10,10,10}>
    <Card elevation={20} onPress={() => { Alert.alert("Not implemented", "Move to expanded view is not yet implemented!")}}>
      <Card.Title subtitle={this._getSubTitle(hit.subId)} title={(<Text style={styles.itemName}>
          <Highlight
            attribute="title"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>)} backgroundColor={hit.color}>      
      </Card.Title>
      <Card.Content backgroundColor={hit.color}>
      <Text style={styles.innerItem}>Evaluation: <Highlight
            attribute="evaluation"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text style={styles.innerItem}>Medications: <Highlight
            attribute="medications"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text style={styles.innerItem}>Signs: <Highlight
            attribute="signs"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text style={styles.innerItem}>Management:
        <Highlight
            attribute="management"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text style={styles.innerItem}>Refereneces:
          <Highlight
            attribute="references"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
      </Card.Content>
    </Card>
    </View>
  );
  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => (
    <View
      key={`${sectionID}-${rowID}`}
      style={{
        height: adjacentRowHighlighted ? 4 : 1,
        backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
      }}
    />
  );
}


Hits.propTypes = {
  hits: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};
const ConnectedHits = connectInfiniteHits(Hits);
const ConnectedStats = connectStats(({ nbHits }) => (
  <Text style={{ paddingLeft: 8 }}>{nbHits} results</Text>
));

