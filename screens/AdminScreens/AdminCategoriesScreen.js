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
  // fix this
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.adminText}>Admin Mode Active</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={1}
<<<<<<< HEAD
        renderItem={(itemData) => (
=======
        renderItem={itemData =>
>>>>>>> 310dc2dde1f0a803cd9478e67d682ecb9d402bc2
          <CategoryGridTile
            title={itemData.item.title}
            color={itemData.item.color}
            // onSelect func name triggers on component
            onSelect={() => {
              selectCategoryHandler(itemData.item.id, itemData.item.title)
            }}
          />
        }
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
<<<<<<< HEAD
    fontStyle:       'italic',
=======
    fontStyle:  'italic',
>>>>>>> 310dc2dde1f0a803cd9478e67d682ecb9d402bc2
    textAlign:       'center',
    height:          20,
  },
<<<<<<< HEAD

  screenContainer :{
    height: '100%',
    backgroundColor: Colors.darkBackgroundColor
  }

=======
  
  screenContainer :{
    height: '100%',
    backgroundColor: Colors.darkBackgroundColor
  },

  separator :{
    marginTop: 5,
  }
>>>>>>> 310dc2dde1f0a803cd9478e67d682ecb9d402bc2
});

export default AdminCategoriesScreen
