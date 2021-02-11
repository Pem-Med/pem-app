import React, { useState, useEffect, useCallback } from 'react'
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
  ImageBackground,
} from 'react-native';
import * as firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../constants/Colors';
import Loading from '../../components/Loading';
// import PhoneInput from "react-native-phone-input";

const EditProfileScreen = (props) => {
  const uid = props.navigation.getParam('userID')
  const db = firebase.database()
  const userRef = db.ref(`users/${uid}/profile`)

  const name = props.navigation.getParam('name')
  const title = props.navigation.getParam('title')
  const number = props.navigation.getParam('number')
  const avatarImage = props.navigation.getParam('avatar')

  const [displayName, setDisplayName] = useState(name)
  const [jobTitle, setJobTitle] = useState(title)
  const [numberType, setNumberType] = useState(number)

  const [errorName, setErrorName] = useState('')
  const [errorTitle, setErrorTitle] = useState('')
  const [errorNumber, setErrorNumber] = useState('')

  const [avatar, setAvatar] = useState(avatarImage)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false);

  function uriToBlob(uri) {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });
  }

  //upload image to firebase
  function uploadToFirebase(blob) {

    return new Promise((resolve, reject) => {

      const storageRef = firebase.storage().ref();
      const imageName = `${uid}_profile`;

      storageRef.child('avatars/' + imageName + '.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {

        blob.close();

        resolve(snapshot.ref.getDownloadURL());

      }).catch((error) => {

        reject(error);

      });

    });
  }

  function addInfo() {
    if (errorName || errorTitle || errorNumber) {
      alert('Invalid input')
    } else {
      setLoading(true);
      let postData = {
        name: displayName,
        title: jobTitle,
        number: numberType
      };

      //Case 1: add info and delete image
      if (avatarImage && !avatar) {
        //remove image from firebase
        firebase.storage().ref(`avatars/${uid}_profile.jpg`)
          .delete()
          .then(() => {
            //update user info in firebase
            postData.avatar = '';
            userRef.update(postData);
          })
          .then(() => {
            setLoading(false);
            props.navigation.goBack();
          })
          .catch(err => {
            setLoading(false);
            Alert.alert('Error', 'There was an error in updating the info.');
          });

      } else if (avatarImage === avatar) {
        //Case 2: Add info only
        userRef.update(postData)
          .then(() => {
            setLoading(false);
            props.navigation.goBack();
          })
          .catch((err) => {
            setLoading(false);
            Alert.alert('Error', 'There was an error in updating the info');
          });
      } else {
        //Case 3: Add info and image
        //first upload image
        uriToBlob(avatar)
          .then((blob) => uploadToFirebase(blob))
          .then((url) => {
            //then update user info in firebase
            postData.avatar = url;
            userRef.update(postData);
          })
          .then(() => {
            setLoading(false);
            props.navigation.goBack();
          })
          .catch((err) => {
            setLoading(false);
            Alert.alert('Error', 'There was an error in updating the info');
          });
      }

    }
  }

  const normalizeInput = (value, previousValue) => {
    if (!value) return value
    const currentValue = value.replace(/[^\d]/g, '')
    const cvLength = currentValue.length

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue
      if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`
    }
  }

  const handleNameChange = (value) => {
    setDisplayName(value)
    if (!value) {
      setErrorName('Name field cannot be empty')
    } else {
      setErrorName(null)
    }
  }

  const handleTitleChange = (value) => {
    setJobTitle(value)
    if (!value) {
      setErrorTitle('Title field cannot be empty')
    } else {
      setErrorTitle(null)
    }
  }
  const handleNumberChange = (value) => {
    if (value === '') {
      setErrorNumber('Number field cannot be empty')
    } else if (value.length <= 13) {
      setErrorNumber('Invalid phone format. ex: (555) 555-5555')
    } else {
      setErrorNumber(null)
    }
    setNumberType((prevState) => (normalizeInput(value, prevState.number)))
  }

  useEffect(() => {
    (async () => {
      if (Platform.ios) {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, camera roll permission is required!')
        }
      }
    })
  }, [])

  const pickImage = async () => {
    const selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
    if (!selectedImage.cancelled) {
      setAvatar(selectedImage.uri)
    }
  }

  const handleDeleteAvatar = async () => {
    setAvatar('')
  }

  const image = !avatar ? require('../../components/img/default-profile-pic.jpg') : { uri: avatar };

  if (loading) {
    return <Loading />
  }

  return (
    <View style={styles.constainer}>
      <ImageBackground
        source={require('../../components/img/colors3.jpeg')}
        style={{ width: '100%', height: '100%' }}
      >
        <ScrollView>
          <View style={{ flexDirection: 'row' }}>
            <View style={[styles.profileImage, { marginLeft: 20 }]}>
              <Image source={image} style={styles.avatar} resizeMode={'cover'} />
            </View>
            <View style={[styles.buttonStyle, { flexDirection: 'column', marginLeft: '5%' }]}>
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
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ marginRight: '2%' }} name={'user'} size={18} />
                <TextInput
                  style={styles.input}
                  value={displayName}
                  placeholder={'Please enter your name'}
                  onChangeText={(text) => handleNameChange(text)}
                />
              </View>
              {!!errorName && (
                <Text style={{ color: 'red' }}>
                  {errorName}
                </Text>
              )}
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Job Title</Text>
              <View style={{ flexDirection: 'row' }}>
                <MaterialIcons style={{ marginRight: '2%' }} name={'work'} size={18} />
                <TextInput
                  style={styles.input}
                  value={jobTitle}
                  placeholder={'Please enter your title'}
                  onChangeText={(text) => handleTitleChange(text)}
                />
              </View>
              {!!errorTitle && (
                <Text style={{ color: 'red' }}>
                  {errorTitle}
                </Text>
              )}
            </View>
            <View style={styles.formControl}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={{ flexDirection: 'row' }}>
                <MaterialIcons style={{ marginRight: '2%' }} name={'phone'} size={18} />
                <TextInput
                  style={styles.input}
                  maxLength={15}
                  keyboardType={'phone-pad'}
                  textContentType={'telephoneNumber'}
                  dataDetectorTypes={'phoneNumber'}
                  value={numberType}
                  placeholder={'Please enter your phone number'}
                  onChangeText={(text) => handleNumberChange(text)}
                />
              </View>
              {!!errorNumber && (
                <Text style={{ color: 'red' }}>
                  {errorNumber}
                </Text>
              )}
            </View>
            <View style={styles.switchStyle}>
              <Text style={styles.label}> Public / Private</Text>
              <Switch style={{ alignSelf: 'flex-start' }} value={isVisible} onValueChange={(newValue) => setIsVisible(newValue)} />
              <Text>{isVisible ? 'Switch is ON' : 'Switch is OFF'}</Text>
            </View>
            <TouchableOpacity style={styles.buttonStyle2} onPress={() => addInfo()}>
              <Text style={styles.button}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

EditProfileScreen.navigationOptions = (navData) => ({
  headerTitle: 'Edit Profile',
})

const screenHeight = Math.round(Dimensions.get('window').height)
const screenWidth = Math.round(Dimensions.get('window').width)

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
  },
  form: {
    margin: 32,
    marginTop: '1%',
  },
  formControl: {
    marginBottom: '3%',
  },
  profileImage: {
    width: screenWidth * 0.36,
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: '4%',
    aspectRatio: 1,
    left: '5%',
    borderColor: 'white',
    borderWidth: 2,
  },
  avatar: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: '4%',
    fontSize: 0.040 * screenWidth,
  },
  input: {
    paddingHorizontal: 2,
    borderBottomColor: Colors.androidCustomWhite,
    borderBottomWidth: 1,
    fontSize: 0.040 * screenWidth,
    flex: 1,
  },
  switchStyle: {
    flex: 1,
    marginTop: '3%',
  },
  buttonImage: {
    borderColor: '#8e44ad',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  buttonStyle: {
    marginTop: screenHeight * 0.035,
    alignContent: 'center',
    alignSelf: 'center',
    left: '10%',
  },
  buttonStyle2: {
    marginTop: screenHeight * 0.025,
    alignContent: 'center',
    alignSelf: 'center',
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
    padding: '6%',
    width: '100%',
    marginTop: '6%',
    right: '5%',
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
  },
  text: {
    fontSize: 0.043 * screenWidth,
    fontWeight: 'bold',
    color: 'white',
  },

})

export default EditProfileScreen
