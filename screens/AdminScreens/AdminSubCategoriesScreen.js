import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, Platform, Button, Alert,ActivityIndicator, View } from 'react-native';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AdminSubCatGrid from '../../components/AdminSubCatGrid';
import * as CatContentActions from '../../store/actions/catContent';
import Colors from '../../constants/Colors';
//react-redux
import { useSelector, useDispatch } from 'react-redux';


const AdminSubCategoriesScreen = props => {

  const [loading, setLoading] = useState(false);

  const categoryId = props.navigation.getParam('categoryId');
  const selectedSubCategories = useSelector(state =>
    state.categoriesContent.categoriesContent.filter(prod => prod.subId === categoryId)
  );
  const dispatch = useDispatch();

  const selectSubCategoryHandler = (id, title) => {
    props.navigation.navigate('CatContent', { subcategoryId: id, subcategoryTitle: title })
  };

  const editSubCategoryHandler = (id, categoryId) => {
    props.navigation.navigate('EditCatContent', { subCatId: id, categoryId: categoryId })
  };

  const deleteSubCategoryHandler = (id) => {
    Alert.alert('Are you sure?', 'Are you sure you want to delete this category?', [{ text: 'No', style: 'default' },
    {
      text: 'Yes', style: 'destructive', onPress: () => {
        dispatch(CatContentActions.deleteCatContent(id));
      }
    }
    ])
  };

  const createHandler = useCallback(() => {
    props.navigation.navigate('EditCatContent', { categoryId: categoryId })
  }, []);

  useEffect(() => {
    props.navigation.setParams({ create: createHandler });
  }, [createHandler]);

  useEffect(() =>{
    const loadingCatContent = async () =>{
      setLoading(true);
      await dispatch(CatContentActions.fetchCatContent());
      setLoading(false);
    };
    loadingCatContent();
    
  },[dispatch, setLoading]);

  if(loading){
    return <View style ={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size = 'large' color ={Colors.primaryColor}/>
    </View>
  }
  return (
    
    <FlatList
      data={selectedSubCategories}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <AdminSubCatGrid
          color={itemData.item.color}
          title={itemData.item.title}
          onSelect={() => { selectSubCategoryHandler(itemData.item.id, itemData.item.title) }}
          edit={() => { editSubCategoryHandler(itemData.item.id, categoryId) }}
          delete={() => { deleteSubCategoryHandler(itemData.item.id) }}
        />
      }
    />
  );
};

AdminSubCategoriesScreen.navigationOptions = navigationdata => {
  const createCat = navigationdata.navigation.getParam('create')
  const catTitle = navigationdata.navigation.getParam('categoryTitle');
  console.log(catTitle)
  return {
    headerTitle: catTitle,
    headerRight:
      () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title='ADD' iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            onPress={
              createCat
            }
          />
        </HeaderButtons>
      ),

  }
}
export default AdminSubCategoriesScreen;


