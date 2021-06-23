import React from 'react'
// import { FlatList, Platform, Text } from 'react-native'
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import CategoryGridTile from '../../components/CategoryGridTile'
import CustomHeaderButton from '../../components/CustomHeaderButton'
// using react redux to acces data
import Colors from '../../constants/Colors'

const AdminCategoriesScreen = (props) => {
  // getting  data from categories in redux store
  const categories = useSelector((state) => state.categories.categories)

  // method to handle what category is selected
  const selectCategoryHandler = (id, title) => {
    props.navigation.navigate({
      routeName: 'AdminSubCategories',
      params:    { categoryId: id, categoryTitle: title },
    })
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.adminText}>Admin Mode Active</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={(itemData) => (
          <CategoryGridTile
            title={itemData.item.title}
            color={itemData.item.color}
            // onSelect func name triggers on component
            onSelect={() => {
              selectCategoryHandler(itemData.item.id, itemData.item.title)
            }}
          />
        )}
      />
    </View>
  )
}
AdminCategoriesScreen.navigationOptions = (navigationdata) => ({
  headerTitle: 'Admin Panel',
  headerLeft:  () => (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title={'Menu'}
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
          navigationdata.navigation.toggleDrawer()
        }}
      />
    </HeaderButtons>
  ),
})

const styles = StyleSheet.create({
  adminText: {
    color:           'white',
    backgroundColor: Colors.secondaryColor,
    fontWeight:      'bold',
    textAlign:       'center',
    height:          20,
  },

  screenContainer :{
    height: '100%',
    backgroundColor: Colors.darkBackgroundColor
  }
  
});

export default AdminCategoriesScreen
