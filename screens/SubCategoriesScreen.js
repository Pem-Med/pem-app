import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import * as firebase from 'firebase'
import 'firebase/firestore';
import Firebase from '../backend/firebase'
import CategoryGridTile from '../components/CategoryGridTile';
//react-redux
import { useSelector, useDispatch } from 'react-redux';
import * as CatContentActions from '.././store/actions/catContent';
import Colors from '../constants/Colors';
import SubCatListItem from "./SubCatListItem";
import AtoZList from 'react-native-atoz-list';
import {backgroundColor} from "react-native-calendars/src/style";

const SubCategoriesScreen = props => {
  const [loading, setLoading] = useState(false);

  const categoryId = props.navigation.getParam('categoryId');
  const selectedSubCategories = useSelector(state =>
    state.categoriesContent.categoriesContent.filter(prod => prod.subId === categoryId)
  );


  const dispatch = useDispatch();
  useEffect(() =>{
    const loadingCatContent = async () =>{
      setLoading(true);
      await dispatch(CatContentActions.fetchCatContent());
      setLoading(false);
    };
    loadingCatContent();

  },[dispatch, setLoading]);
  function screenBackgroundColor() {
    let title = props.navigation.getParam('categoryTitle') //get category title
      switch (title) {
        case "Medical":
          return Colors.medicalTile
          break
        case "Surgical":
          return Colors.surgicalTile
          break
        case "Trauma":
          return Colors.traumaTile
          break
        case "Toxicology":
          return Colors.toxicologyTile
          break
        case "Foreign Ingestion":
          return Colors.foreignTile
          break
        default:
          return Colors.white
      }
  }
  const selectSubCategoryHandler = (id, title, icon) => {
      props.navigation.navigate({
        routeName: 'CatContent',
        params: {
          subcategoryId: id,
          subcategoryTitle: title,
          subcategoryIcon: icon,
        }
      });
  };
  let subCatBackgroundColor = screenBackgroundColor()

  if(loading){
    return <View style ={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size = 'large' color ={Colors.primaryColor}/>
    </View>
  }

//Sort Sub categories alphabetically
  selectedSubCategories.sort(function (a, b) {
      let itemA = a.title.toUpperCase();
      let itemB = b.title.toUpperCase();
    return (itemA < itemB) ? -1 : (itemA > itemB) ? 1 : 0
  });

  return (
      <View style={{backgroundColor : subCatBackgroundColor}}>
    <FlatList
      data={selectedSubCategories}
      keyExtractor={item => item.id}
      numColumns={1}
      renderItem={itemData =>
        <SubCatListItem
          title={itemData.item.title}
          color={itemData.item.color}
          icon={itemData.item.icon}
          onSelect={() => {
            selectSubCategoryHandler(itemData.item.id, itemData.item.title, itemData.item.icon)
          }}
        />
      }
    />
      </View>
  );
};

SubCategoriesScreen.navigationOptions = navigationdata => {
  const catTitle = navigationdata.navigation.getParam('categoryTitle');
  console.log(catTitle)
  return {
    headerTitle: catTitle,
    headerStyle: {
      backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white'
    },
  }
}
export default SubCategoriesScreen;
