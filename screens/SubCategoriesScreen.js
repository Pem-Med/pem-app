/*
 * Credits for the Alpha-Scroll-Bar to: //https://github.com/bardog/Alpha-scroll-flat-list
 */

import React, { useState, useEffect } from "react";
import { View, Platform, ActivityIndicator } from "react-native";

import "firebase/firestore";

//react-redux
import { useSelector, useDispatch } from "react-redux";
import * as CatContentActions from ".././store/actions/catContent";
import Colors from "../constants/Colors";
import SubCatListItem from "./SubCatListItem";
import AtoZList from "react-native-atoz-list";
import { backgroundColor } from "react-native-calendars/src/style";

import AlphabeticalDivider from "../components/AlphabeticalDivider";
import AlphaScrollFlatList from "alpha-scroll-flat-list";

const ITEM_HEIGHT = 86; //Has to be the same height of the ScrollItem

//This Logic is to Organize the Subcategories by Letter
let lastWord = "1temp";
function compare(current) {
  if (current.charAt(0) === lastWord.charAt(0)) return false;
  lastWord = current;
  return true;
}

const SubCategoriesScreen = (props) => {
  const [loading, setLoading] = useState(false);

  const categoryId = props.navigation.getParam("categoryId");
  const selectedSubCategories = useSelector((state) =>
    state.categoriesContent.categoriesContent.filter(
      (prod) => prod.subId === categoryId
    )
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const loadingCatContent = async () => {
      setLoading(true);
      await dispatch(CatContentActions.fetchCatContent());
      setLoading(false);
    };
    loadingCatContent();
  }, [dispatch, setLoading]);

  function screenBackgroundColor() {
    let title = props.navigation.getParam("categoryTitle"); //get category title
    switch (title) {
      case "Medical":
        return Colors.medical;
        break;
      case "Surgical":
        return Colors.surgical;
        break;
      case "Trauma":
        return Colors.trauma;
        break;
      case "Toxicology":
        return Colors.toxicology;
        break;
      case "Foreign Ingestion":
        return Colors.foreign;
        break;
      default:
        return Colors.white;
    }
  }
  const selectSubCategoryHandler = (id, title, icon) => {
    props.navigation.navigate({
      routeName: "CatContent",
      params: {
        subcategoryId: id,
        subcategoryTitle: title,
        subcategoryIcon: icon,
      },
    });
  };
  let subCatBackgroundColor = screenBackgroundColor();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  //Sort Sub categories alphabetically
  selectedSubCategories.sort(function (a, b) {
    let itemA = a.title.toUpperCase();
    let itemB = b.title.toUpperCase();
    return itemA < itemB ? -1 : itemA > itemB ? 1 : 0;
  });

  function renderItem({ item }) {
    return (
      <View>
        {compare(item.title) && <AlphabeticalDivider text={item.title} />}
        <SubCatListItem
          title={item.title}
          color={item.color}
          icon={item.icon}
          onSelect={() => {
            selectSubCategoryHandler(item.id, item.title, item.icon);
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: subCatBackgroundColor }}>
      <AlphaScrollFlatList
        keyExtractor={(item) => item.id}
        data={selectedSubCategories}
        renderItem={renderItem.bind(this)}
        scrollKey={"title"}
        reverse={false}
        itemHeight={ITEM_HEIGHT}
        activeColor={"#a5a5a5"} //Focus Color
        scrollBarColor={"#000000"} //Font Color
        scrollBarContainerStyle={{
          backgroundColor: "rgba(150, 150, 150,0.5)",
        }}
      />
    </View>
  );
};

SubCategoriesScreen.navigationOptions = (navigationdata) => {
  const catTitle = navigationdata.navigation.getParam("categoryTitle");
  return {
    headerTitle: catTitle,
    headerStyle: {
      backgroundColor:
        Platform.OS === "android" ? Colors.primaryColor : "white",
    },
  };
};
export default SubCategoriesScreen;
