import React, { useState, Component } from 'react';
import {InstantSearch,
  connectSearchBox,
  connectStats,
  connectSortBy,
  connectInfiniteHits

} from "react-instantsearch-dom";
import algoliasearch from 'algoliasearch/lite';
import Highlight from './Highlight';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Text, View, TextInput, Button, FlatList } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { CONTENT, SUBCATEGORIES } from '../data/categoriesData';
import SearchGridtile from '../components/SearchGridTile';
import { useSelector} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import CatContent from '../models/catContent';
import CategoriesScreen from './CategoriesScreen';
import Category from '../models/category';

const  {height}  = Dimensions.get('window');

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  items: {
    ...Platform.select({
      ios: {
        height: height - 170,
      },
      android: { height: height - 165 },
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
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  searchBoxContainer: {
    backgroundColor: '#162331',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,

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
        borderRadius: 5,
      },
      android: {},
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
  },
  button:{
    justifyContent:'flex-start',
    flexDirection:'column',
    textAlign:'right',
  },
});
const searchClient = algoliasearch(
  'WK4HK1IJPD',
  '3ce1d6fd9eb17d864916020e10616a2d'
);


class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: this.props.searchState ? this.props.searchState : {},
    };
  }
  onSearchStateChange = nextState => {
    this.setState({ searchState: { ...this.state.searchState, ...nextState } });
  };
  
  

  render() {
    return (
      <View style={styles.maincontainer}>
          <InstantSearch searchClient={searchClient}
            appId="WK4HK1IJPD"
            apiKey="3ce1d6fd9eb17d864916020e10616a2d"
            indexName="med_Categories">
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
          autoCapitalize={'none'}
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

function routeToCat({navigation}) {
  navigation.navigate({
    routeName: 'CatContent',
    params: {
      subcategoryId: x
    }
  });
};



class Hits extends Component {
  onEndReached = () => {
    if (this.props.hasMore) {
      this.props.refine();
    }
  };

  render() {
    const hits =
      this.props.hits.length > 0 ? (
        <View style = {styles.items}>
          <FlatList data={this.props.hits} renderItem={this._renderRow} />
        </View>
      ) : null;
    return hits;
  }

  _renderRow = ({ item: hit }) => (

    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>
          <Highlight
            attribute="title"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>

        <Text >Evaluation: <Highlight
            attribute="evaluation"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text >Medications: <Highlight
            attribute="medications"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text >Signs:
        <Highlight
            attribute="signs"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text >Management:
        <Highlight
            attribute="management"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>
        <Text >Refereneces:
          <Highlight
            attribute="references"
            hit={hit}
            highlightProperty="_highlightResult"
          />
        </Text>

      </View>
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
  <Text style={{ paddingLeft: 8 }}>{nbHits} products found</Text>
));


/*

const SearchScreen = props => {// to be call Search

  let changingText = '';
  const [enteredSearch, setEnteredSearch] = useState('');
  const [search, setSearch] = useState([]);
  const [result, setResult] = useState('null');//use null value because if it's empty, filter will display all

  const searchInputHandler = (enteredText) => {
    setEnteredSearch(enteredText)
  }

  const searchWord = () => {
    setResult(enteredSearch)
  }

  const selectedSubCategories = useSelector((state) => state.categoriesContent.categoriesContent,
  )
  const displaySub = selectedSubCategories.filter((cat) => ((cat.title).toLowerCase().indexOf(result.toLowerCase()) >= 0) && cat.title != 'Chatroom' && cat.title != 'CME')

  const renederGridItem = (itemData) => (
    <SearchGridtile
      title={itemData.item.title}
      color={itemData.item.color}
      onSelect={() => { // onSelect func name trigget on component
        props.navigation.navigate({
          routeName: 'CatContent',
          params:    {
            subcategoryId: itemData.item.id,
          },
        })
      }}
    />
  )

  return (
    <View style={styles.screen}>
      <View style={styles.inputContainer}>
        <Ionicons name={Platform.OS === 'android' ? 'ios-search' : 'md-search'} size={20} />
        <TextInput
          placeholder={'Search '}
          style={styles.input}
          onChangeText={searchInputHandler}
          Value={enteredSearch}
        />
        <Button title={'Search'} style={styles.searchButton} onPress={searchWord} />
      </View>
      <FlatList data={displaySub} renderItem={renederGridItem} numColumns={1} />
    </View>
  )
}

const styles = StyleSheet.create({

  screen: {
    padding: 50,
  },
  inputContainer: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  input: {
    width:             '80%',
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
  },
  searchButton: {
    borderStyle: 'solid',
    borderColor: 'blue',
  },
  searchButton: {
    borderStyle: 'solid',
    borderColor: 'blue'
  }

});
*/
