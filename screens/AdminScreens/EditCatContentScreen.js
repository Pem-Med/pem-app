import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, TextInput, StyleSheet, ScrollView, Platform, Button, Image,
} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import CustomHeaderButton from '../../components/CustomHeaderButton'
import * as CatContentActions from '../../store/actions/catContent'
import Colors from '../../constants/Colors'

const EditCatContentScreen = props => {

    const categoryId = props.navigation.getParam('categoryId');
    const subCategoryId = props.navigation.getParam('subCatId');
    const editedSelectedSubCategories = useSelector(state =>
        state.categoriesContent.categoriesContent.find(prod => prod.id === subCategoryId)
    );

    const selectedCategory = useSelector(state =>
        state.categories.categories.find(prod => prod.id === categoryId)
    );

    const SelectedSubCategories = useSelector(state =>
        state.categoriesContent.categoriesContent
    );
    const dispatch = useDispatch();

    const [title, setTitle] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.title : '');
    const [evaluation, setEvaluation] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.evaluation : '');
    const [signs, setSigns] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.signs : '');
    const [management, setManagement] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.management : '');
    const [medications, setMedications] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.medications : '');
    const [references, setReferences] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.references : '');
    const [image, setImage] = useState(editedSelectedSubCategories ? editedSelectedSubCategories.image : null);
    const [textBoxWidth, SetTextBoxWidth] = useState('99%');

    const submitHandler = useCallback(() => {
        if (editedSelectedSubCategories) {
            dispatch(CatContentActions.updateCatContent(subCategoryId, title, evaluation, signs, management, medications, references, image));
        }
        else {

            dispatch(CatContentActions.createCatContent(title, selectedCategory.color, selectedCategory.id, evaluation, signs, management, medications, references, image));
        }
        props.navigation.goBack();
    }, [dispatch, subCategoryId, selectedCategory.color, selectedCategory.id, title, evaluation, signs, management, medications, references, editedSelectedSubCategories, image]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);


    // The purpose of useEffect here is to be able
    //to solve the issue of clipboard functionality within TextInput.
    useEffect(() => {
        setTimeout(() => {
            SetTextBoxWidth(prev => '100%');
        }, 100);
    }, [textBoxWidth]);

    useEffect(() => {
        (async () => {
            if (Platform.ios) {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, camera roll permission is required!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let selectedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!selectedImage.cancelled) {
            setImage(selectedImage.uri);
        }
    };

    const removeImage = () => {

        setImage( Platform.OS === 'android' ? null : " ");
    }

    return (
        <ScrollView>
            <View syle={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.font}>Title</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        value={title}
                        onChangeText={text => setTitle(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.font}>Evaluation</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        multiline={true}
                        value={evaluation}
                        onChangeText={text => setEvaluation(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.font}>Signs</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        multiline={true}
                        value={signs}
                        onChangeText={text => setSigns(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.font}> Management</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        multiline={true}
                        value={management}
                        onChangeText={text => setManagement(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.font}> Medications</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        multiline={true} value={medications}
                        onChangeText={text => setMedications(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.font}> References</Text>
                    <TextInput
                        style={{ ...styles.input, ...{ width: textBoxWidth } }}
                        multiline={true}
                        value={references}
                        onChangeText={text => setReferences(text)}
                        //keyboardType="default"
                        autoCapitalize="sentences"
                        returnKeyType="next"
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.imageContainer}>
                    <View style={styles.buttonAttach}>
                        <Button
                            color= {Colors.EditBlueColor}
                            title='Attach Image'
                            onPress={pickImage}
                        />

                    </View>
                    <View style={styles.buttonRemove}>
                         <Button
                            color={Colors.primaryColor}
                            title='Remove Image'
                            onPress={removeImage}
                        />
                    </View>
                    <View style={styles.imageContainer}>
                        {image && <Image style={styles.ImageSize} source={{ uri: image }} />}
                    </View>

                </View>

            </View>

        </ScrollView>
    );
};

EditCatContentScreen.navigationOptions = navigationData => {
    const submitChanges = navigationData.navigation.getParam('submit')
    return {
        headerTitle:
            navigationData.navigation.getParam('subCatId')
              ? 'Edit Category'
              : 'Add Category',
    headerRight:
            () => (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                  title={'Save'}
                  iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                  onPress={submitChanges}
                />
              </HeaderButtons>
            ),
  }
}

const styles = StyleSheet.create({
    form: {
        margin: 20,

    },
    formControl: {
        width: '100%',
        paddingHorizontal: 30,
    },
    imageContainer: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 25,
    },
    ImageSize: {
        width: '100%',
        height: 200
    },
    buttonAttach: {
        width: '55%',
        paddingBottom: 10
    },
    buttonRemove: {
        width: '55%',

    },
    font: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderColor: Colors.primaryColor,
        backgroundColor: Colors.androidCustomWhite,
        borderWidth: 1
    }
});

export default EditCatContentScreen;
