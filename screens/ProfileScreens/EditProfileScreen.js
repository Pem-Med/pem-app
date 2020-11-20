import React, { useState, useEffect, useCallback } from 'react';
import {
    Dimensions,
    Image,
    Alert,
    View,
    ScrollView,
    Button,
    Text,
    StyleSheet,
    Platform,
    TextInput,
    TouchableOpacity,
    Switch,
    ImageBackground
} from 'react-native';
import { HelperText, HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/CustomHeaderButton';
import Colors from '../../constants/Colors';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import UserPermission from '../../utilities/UserPermission';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
//import PhoneInput from "react-native-phone-input";

const EditProfileScreen = props => {

    const uid = props.navigation.getParam('userID');
    const db = firebase.database()
    const userRef = db.ref('users/' + uid + '/profile')

    const name = props.navigation.getParam('name');
    const title = props.navigation.getParam('title');
    const number = props.navigation.getParam('number');
    const avatarImage = props.navigation.getParam('avatar');

    const [displayName, setDisplayName] = useState(name);
    const [jobTitle, setJobTitle] = useState(title);
    const [numberType, setNumberType] = useState(number);

    const [errorName, setErrorName] = useState('');
    const [errorTitle, setErrorTitle] = useState('');
    const [errorNumber, setErrorNumber] = useState('');

    const [avatar, setAvatar] = useState(avatarImage);
    const [isVisible, setIsVisible] = useState(false);

    function addInfo() {
        if (errorName || errorTitle || errorNumber) {
            alert("Invalid input")
        } else {
            var postData = {
                name: displayName,
                title: jobTitle,
                number: numberType,
                avatar: avatar,
            };
            userRef.update(postData)
            props.navigation.goBack();
        }
    };

    const normalizeInput = (value, previousValue) => {
        if (!value) return value;
        const currentValue = value.replace(/[^\d]/g, '');
        const cvLength = currentValue.length;

        if (!previousValue || value.length > previousValue.length) {
            if (cvLength < 4) return currentValue;
            if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
            return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
        }
    };

    const handleNameChange = (value) => {
        setDisplayName(value)
        if (!value) {
            setErrorName("Name field cannot be empty")
        } else {
            setErrorName(null)
        }
    }

    const handleTitleChange = (value) => {
        setJobTitle(value)
        if (!value) {
            setErrorTitle("Title field cannot be empty")
        } else {
            setErrorTitle(null)
        }
    }
    const handleNumberChange = (value) => {
        if (value === "") {
            setErrorNumber("Number field cannot be empty")
        }
        else if (value.length <= 13) {
            setErrorNumber("Invalid phone format. ex: (555) 555-5555")
        }
        else {
            setErrorNumber(null)
        }
        setNumberType(prevState => (normalizeInput(value, prevState.number)));
    };

    useEffect(() => {
        (async () => {
            if (Platform.ios) {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, camera roll permission is required!');
                }
            }
        });
    }, []);

    const pickImage = async () => {
        let selectedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        if (!selectedImage.cancelled) {
            setAvatar(selectedImage.uri);
        }
    };

    const handleDeleteAvatar = async () => {
        setAvatar('')
    }

    var image = !avatar ? require('../../components/img/default-profile-pic.jpg') : { uri: avatar };

    return (
        <View style={styles.constainer}>
            <ImageBackground source={require('../../components/img/colors3.jpeg')}
                style={{ width: '100%', height: '100%' }}>
                <ScrollView>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.profileImage, { marginLeft: 20 }]}>
                            <Image source={image} style={styles.avatar} resizeMode="cover"></Image>
                        </View>
                        <View style={[styles.buttonStyle, { flexDirection: 'column', marginLeft: "5%" }]}>
                            <TouchableOpacity style={styles.buttonText} onPress={pickImage}>
                                <Text style={styles.text}>Upload Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonText} onPress={handleDeleteAvatar}>
                                <Text style={styles.text}>Delete Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.formControl}>
                            <Text style={styles.label}>Fullname</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Icon style={{ marginRight: "2%" }} name="user" size={18}></Icon>
                                <TextInput
                                    style={styles.input}
                                    value={displayName}
                                    placeholder="Please enter your name"
                                    onChangeText={text => handleNameChange(text)}>
                                </TextInput>
                            </View>
                            {!!errorName && (
                                <Text style={{ color: 'red' }}>
                                    {errorName}
                                </Text>
                            )}
                        </View>
                        <View style={styles.formControl}>
                            <Text style={styles.label}>Job Title</Text>
                            <View style={{ flexDirection: "row" }}>
                                <MaterialIcons style={{ marginRight: "2%" }} name="work" size={18}></MaterialIcons>
                                <TextInput
                                    style={styles.input}
                                    value={jobTitle}
                                    placeholder="Please enter your title"
                                    onChangeText={text => handleTitleChange(text)}>
                                </TextInput>
                            </View>
                            {!!errorTitle && (
                                <Text style={{ color: 'red' }}>
                                    {errorTitle}
                                </Text>
                            )}
                        </View>
                        <View style={styles.formControl}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={{ flexDirection: "row" }}>
                                <MaterialIcons style={{ marginRight: "2%" }} name="phone" size={18}></MaterialIcons>
                                <TextInput
                                    style={styles.input}
                                    maxLength={15}
                                    keyboardType={'phone-pad'}
                                    textContentType='telephoneNumber'
                                    dataDetectorTypes='phoneNumber'
                                    value={numberType}
                                    placeholder="Please enter your phone number"
                                    onChangeText={text => handleNumberChange(text)}>
                                </TextInput>
                            </View>
                            {!!errorNumber && (
                                <Text style={{ color: 'red' }}>
                                    {errorNumber}
                                </Text>
                            )}
                        </View>
                        <View style={styles.switchStyle}>
                            <Text style={styles.label}> Public / Private</Text>
                            <Switch style={{ alignSelf: 'flex-start' }} value={isVisible} onValueChange={newValue => setIsVisible(newValue)}></Switch>
                            <Text>{isVisible ? 'Switch is ON' : 'Switch is OFF'}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonStyle2} onPress={() => addInfo()}>
                            <Text style={styles.button}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

EditProfileScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Edit Profile',
    }
}

let screenHeight = Math.round(Dimensions.get('window').height);
let screenWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    constainer: {
        flex: 1,
        height: screenHeight,
        width: screenWidth
    },
    form: {
        margin: 32,
        marginTop: "1%"
    },
    formControl: {
        marginBottom: "3%"
    },
    profileImage: {
        width: screenWidth * 0.36,
        borderRadius: 100,
        overflow: "hidden",
        marginTop: "4%",
        aspectRatio: 1,
        left: "5%",
        borderColor: "white",
        borderWidth: 2
    },
    avatar: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: "4%",
        fontSize: 0.040 * screenWidth
    },
    input: {
        paddingHorizontal: 2,
        borderBottomColor: Colors.androidCustomWhite,
        borderBottomWidth: 1,
        fontSize: 0.040 * screenWidth,
        flex: 1
    },
    switchStyle: {
        flex: 1,
        marginTop: "3%",
    },
    buttonImage: {
        borderColor: '#8e44ad',
        backgroundColor: 'white',
        borderRadius: 0,
        borderWidth: 3,
    },
    buttonStyle: {
        marginTop: screenHeight * 0.035,
        alignContent: "center",
        alignSelf: "center",
        left: "10%"
    },
    buttonStyle2: {
        marginTop: screenHeight * 0.025,
        alignContent: "center",
        alignSelf: "center",
    },
    button: {
        backgroundColor: Colors.primaryColor,
        borderColor: 'white',
        borderRadius: 20,
        color: 'white',
        fontSize: 0.045 * screenWidth,
        fontWeight: 'bold',
        overflow: 'hidden',
        padding: 13,
        textAlign: 'center',
    },
    switchStyle: {
        flex: 1,
    },
    buttonText: {
        alignItems: 'center',
        backgroundColor: Colors.androidCustomWhite,
        padding: "6%",
        width: "100%",
        marginTop: "6%",
        right: "5%",
        backgroundColor: Colors.primaryColor,
        borderRadius: 10
    },
    text: {
        fontSize: 0.043 * screenWidth,
        fontWeight: 'bold',
        color: 'white',
    }

});

export default EditProfileScreen;