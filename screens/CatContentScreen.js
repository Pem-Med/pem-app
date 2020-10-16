import React from 'react'
import {
  View, Text, StyleSheet, ScrollView, Image,
} from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import CategoriesScreen from './CategoriesScreen'
import CatContentLayout from '../components/CatContentLayout'
import Colors from '../constants/Colors'

const CatContentScreen = (props) => {
  const categoryId = props.navigation.getParam('subcategoryId')
  const selectedSubCategories = useSelector((state) => state.categoriesContent.categoriesContent.find((prod) => prod.id === categoryId),
  )

  return (
    <ScrollView>
      <View>
        <CatContentLayout
          evaluation={selectedSubCategories.evaluation}
          name={'EVALUATION'}
        />
        <CatContentLayout
          management={selectedSubCategories.management}
          name={'MANAGEMENT'}
        />
        <CatContentLayout
          medications={selectedSubCategories.medications}
          name={'MEDICATION'}
        />
        <CatContentLayout
          signs={selectedSubCategories.signs}
          name={'SYMPTOMS'}
        />
        <CatContentLayout
          references={selectedSubCategories.references}
          name={'REFERENCES'}
        />
      </View>

      <View style={styles.imageContainer}>
        <Image style={styles.ImageSize} source={{ uri: selectedSubCategories.image }} />
      </View>
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  imageContainer: {
    alignItems:        'center',
    width:             '100%',
    height:            300,
    paddingVertical:   10,
    paddingHorizontal: 15,
  },
  ImageSize: {
    width:  '100%',
    height: '100%',
  },
})

CatContentScreen.navigationOptions = (navigationdata) => {
  const subcategoryTitle = navigationdata.navigation.getParam('subcategoryTitle')
  return {
    headerTitle: subcategoryTitle,
    headerStyle: {
      backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white',
    },
  }
}

export default CatContentScreen
