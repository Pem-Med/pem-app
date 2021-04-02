import React, { useState, Component, useEffect } from "react";
import {
  InstantSearch,
  connectSearchBox,
  connectStats,
  connectInfiniteHits,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
  ColorPropType,
  SectionList,
} from "react-native";
import { Card } from "react-native-paper";
import Colors from "../constants/Colors";
import algoliaConfig from "../algoliaConfig";
import { useSelector, useDispatch } from "react-redux";
import * as CatContentActions from ".././store/actions/catContent";
import CustomAccordionList from "../components/CustomAccordionList";
import Highlight from "../components/Highlight";

const { height } = Dimensions.get("window");
//TODO: Add 'Search results Provided by Algolia' as per Algolia free account requirements.
//Algolia Search, App ID and API Key (Search Only)
//All in one place, so no need to search for every place its used
const appID = algoliaConfig.appID;
const apiKey = algoliaConfig.searchKey;
const indexName = "med_Categories";

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
      android: { height: height - 200 },
    }),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 5,
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  searchBoxContainer: {
    alignContent: "flex-end",
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
  },
  searchBox: {
    backgroundColor: "white",
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
    display: "flex",
    marginRight: 5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 5,
    textTransform: "capitalize",
  },
  innerItem: {
    fontSize: 15,
    paddingBottom: 5,
    textTransform: "capitalize",
  },
  button: {
    justifyContent: "flex-start",
    flexDirection: "column",
    textAlign: "right",
  },
});
const searchClient = algoliasearch(appID, apiKey);

const SearchScreen = (props) => {
  //class SearchScreen extends Component {
  const state = {
    searchState: props.searchState ? props.searchState : {},
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //class SearchBox extends Component {
  useEffect(() => {
    const loadingCatContent = async () => {
      console.log("Getting categories");
      setLoading(true);
      await dispatch(CatContentActions.fetchCatContent());
      setLoading(false);
      console.log("Got Categories");
    };
    loadingCatContent();
  }, [dispatch, setLoading]);

  const onSearchStateChange = (nextState) => {
    setState({ searchState: { ...state.searchState, ...nextState } });
  };

  const navigateTo = (subCatID, title) => {
    props.navigation.navigate({
      routeName: "CatContent",
      params: {
        subcategoryId: subCatID,
        subcategoryTitle: title,
      },
    });
  };

  return (
    <View style={styles.maincontainer}>
      <InstantSearch
        searchClient={searchClient}
        appId={appID}
        apiKey={apiKey}
        indexName={indexName}
      >
        <ConnectedSearchBox />
        <View style={styles.options}>
          <ConnectedStats />
        </View>
        <ConnectedHits navigateTo={(id, title) => navigateTo(id, title)} />
      </InstantSearch>
    </View>
  );
};
SearchScreen.propTypes = {
  searchState: PropTypes.object,
};

export default SearchScreen;

const SearchBox = (props) => {
  return (
    <View style={styles.searchBoxContainer}>
      <TextInput
        style={styles.searchBox}
        onChangeText={(text) => props.refine(text)}
        value={props.currentRefinement}
        placeholder={"Search ..."}
        clearButtonMode={"always"}
        underlineColorAndroid={"white"}
        spellCheck={false}
        autoCorrect={false}
        autoCapitalize={"sentences"}
      />
    </View>
  );
};

SearchBox.propTypes = {
  refine: PropTypes.func.isRequired,
  currentRefinement: PropTypes.string,
};

const ConnectedSearchBox = connectSearchBox(SearchBox);
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
          <FlatList
            keyExtractor={(hit) => hit.objectID}
            data={this.props.hits}
            renderItem={this._renderRow}
          />
        </View>
      ) : (
        <Text> No Items Found </Text>
      );
    return hits;
  }

  /* Get the category based on the category id*/
  _getSubTitle = (cat) => {
    switch (cat) {
      case "c1":
        return "Medical";
      case "c2":
        return "Surgical";
      case "c3":
        return "Trauma";
      case "c4":
        return "Toxicology";
      case "c5":
        return "Foreign Ingestion";
    }
  };

  _renderRow = ({ item: hit }) => (
    //Create card with padding 10 all arround and elevation of 20
    //bg color is extracted from hit
    <View padding={(10, 10, 10, 10)}>
      <Card
        elevation={20}
        onPress={() => this.props.navigateTo(hit.objectID, hit.title)}
      >
        <Card.Title
          subtitle={this._getSubTitle(hit.subId)}
          title={
            <Text style={styles.itemName}>
              <Highlight
                attribute="title"
                hit={hit}
                highlightProperty="_highlightResult"
              />
            </Text>
          }
          backgroundColor={hit.color}
        ></Card.Title>
        <Card.Content backgroundColor={hit.color}>
          <CustomAccordionList
            item={hit}
            section={"evaluation"}
          ></CustomAccordionList>
          <CustomAccordionList
            item={hit}
            section={"medications"}
          ></CustomAccordionList>
          <CustomAccordionList
            item={hit}
            section={"signs"}
          ></CustomAccordionList>
          <CustomAccordionList
            item={hit}
            section={"management"}
          ></CustomAccordionList>
          <CustomAccordionList
            item={hit}
            section={"references"}
          ></CustomAccordionList>
        </Card.Content>
      </Card>
    </View>
  );

  _renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => (
    <View
      key={`${sectionID}-${rowID}`}
      style={{
        height: adjacentRowHighlighted ? 4 : 1,
        backgroundColor: adjacentRowHighlighted ? "#3B5998" : "#CCCCCC",
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
  <View style={{ flex: 1 }}>
    <Text style={{ paddingLeft: 8 }}>{nbHits} results</Text>
    <Text style={{ textAlign: "right", paddingRight: 8, color: "#A7A9A9" }}>
      Search Results provided by Algolia Instant Search
    </Text>
  </View>
));
