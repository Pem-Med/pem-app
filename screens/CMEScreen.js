import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import * as ImagePicker from 'expo-image-picker'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native'
import * as firebase from 'firebase'
import Colors from '../constants/Colors'
import 'firebase/firestore'
import Firebase from '../backend/firebase'
import 'firebase/storage';

// This will be the list of all CMEs the user has.
let cmes = []

// This represents one CME the user would like to
// add to the list of CMEs.
const newCme = {
  newCmeCert: '',
  newCmeExp:  '',
  newCmePic:  '',
}



function displayOKAlert(title, message) {
  Alert.alert(title, message)
}

export default class CME extends Component {
  /**
   * This constructor initializes the cmes array.
   * @param {Object} props
   */
  constructor(props) {
    firebase
      .database()
      .ref(`userCmes/userId:${firebase.auth().currentUser.uid}`)
      .once('value')
      .then((snapshot) => {
        console.log('SNAPSHOT.VAL', snapshot.val())
        cmes = snapshot.val() === null ? [] : snapshot.val().cmes
      })
      .catch((err) => {
        console.log('ERROR GETTING CME DATA:', err)
      })
    super(props)
    this.state = {
      cmes,
    }
    console.log('BEGINNING STATE IS', this.state.cmes)
    this.handleCmeCert = this.handleCmeCert.bind(this)
    this.handleCmeExp = this.handleCmeExp.bind(this)
    this.handleCmePic = this.handleCmePic.bind(this)
    this.addCme = this.addCme.bind(this)
  }

  static navigationOptions = {
    title: 'CME',
  };

  handleCmeCert(text) {
    newCme.newCmeCert = text
  }

  handleCmeExp(date) {
    newCme.newCmeExp = date
  }

  handleCmePic(pic) {
    newCme.newCmePic = pic
  }

  /**
   * Checks the userDate the user input to see if it's a valid date.
   * "Valid", in this case, simply means "is a date" and "is tomorrow
   * or later".
   * @param {string} userDate
   */
  isValidDate(userDate) {
    console.log('USERDATE', userDate)
    const expDateMillis = Date.parse(userDate)
    console.log('EXPDM', expDateMillis)
    console.log('EXPDMbool', expDateMillis === NaN)
    console.log('EXPDMbool2', expDateMillis == NaN)
    console.log('EXPDM2', expDateMillis)
    console.log('EXPDMbool3', !expDateMillis)
    if (!expDateMillis) {
      console.log('RETURNING FIRST FALSE')
      displayOKAlert(
        'Invalid date format',
        'Please format your date as MM/DD/YYYY',
      )
      return false
    }
    const today = new Date()
    const todayMillis = Date.parse(
      `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`,
    )

    if (todayMillis - expDateMillis >= 0) {
      /*
      If todayMillis - expDateMillis >= 0, then that means that the renewal date is either the same day
      or earlier than the current date. I'm not allowing this since renewal dates supposed to be in the
      future.
      */
      displayOKAlert(
        'Invalid date',
        'Please make sure your date is later than today',
      )
      return false
    }
    console.log('RETURNING TRUE')
    return true
  }

  /**
   * Adds a newCme to the cmes array. It checks if the newCmeCert field is
   * NOT empty and if newCmeExp is a valid date. If both of those check out,
   * newCme is added and this.state.cmes is set to the cmes list. It also
   * sets the userCmes in Firebase to the cmes list.
   */
  addCme()  {
    console.log('NEWCME:', newCme)
    if (newCme.newCmeCert != '' && this.isValidDate(newCme.newCmeExp)) {
      cmes.push({
        cert: newCme.newCmeCert,
        exp:  newCme.newCmeExp,
        pic:  newCme.newCmePic,
      })

      this.setState({
        cmes,
      })
      console.log('STATE IS', this.state)

      firebase
        .database()
        .ref(`userCmes/userId:${firebase.auth().currentUser.uid}`)
        .set({
          cmes,
        })
        .catch((err) => {
          console.log('ERROR IN SETTING userCmes/userId:', err)
        })
        this.uriToBlob(newCme.newCmePic).then((blob) => this.uploadToFirebase(blob));
    } else {
      console.log(
        "One or both of the fields in newCme are empty. We can't have that.",
      )
    }
  }

  uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {
  
      const xhr = new XMLHttpRequest();
  
      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };
  
      // this helps us get a blob
      xhr.responseType = 'blob';
  
      xhr.open('GET', uri, true);
      xhr.send(null);
  
    });
  }
  
  uploadToFirebase = (blob) => {
  
    return new Promise((resolve, reject)=>{
  
      var storageRef = firebase.storage().ref();
      let imageName = newCme.newCmeCert;
  
      storageRef.child('uploads/' + imageName + '.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot)=>{
  
        blob.close();
  
        resolve(snapshot);
  
      }).catch((error)=>{
  
        reject(error);
  
      });
  
    });
  } 

  componentWillMount(){
    this.setState({ cmes: cmes });
  }

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.header}>Add New Document Here</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={styles.textField}
            onChangeText={this.handleCmeCert}
            placeholder={'Document Name'}
          />
        </View>

        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Text style={styles.header}>Renewal Date</Text>
          <DatePicker
            style={{
              flex:        1,
              alignSelf:   'center',
              width:       '80%',
              marginRight: '9%',
              marginTop:   '2%',
              color: 'black',
            }}
            date={this.state.date} // initial date from state
            mode={'date'}
            placeholder={'Select date'}
            format={'MM/DD/YYYY'}
            confirmBtnText={'Confirm'}
            cancelBtnText={'Cancel'}
            onDateChange={(date) => { this.setState({ date }, this.handleCmeExp(date)) }}
            customStyles={{
              dateIcon: {
                position:   'absolute',
                left:       0,
                top:        4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
          />
        </View>

        <View style={{ flexDirection: 'column', marginTop: '15%' }}>
          <View style={[styles.addCmeButton, { flexDirection: 'column', backgroundColor: Colors.primaryColor }]}>
            <TouchableOpacity style={styles.buttonText} onPress={this.pickImage}>
              <Text style={styles.text}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addCmeButton} onPress={this.addCme}>
            <Text style={styles.text}>Add Document</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={{ marginTop: '5%', flexGrow: 0, marginBottom: '2%' }}
          data={this.state.cmes}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.cmeItem}>{(item.id, item.cert)}</Text>
              <Text style={styles.cmeItem}>{(item.id + 1, item.exp)}</Text>
              <Image style={{flex: 2, height:150}} source={{ uri: item.pic}}/>
            </View>
          )}
          //numColumns={1}
        />

      </View>
    )
  }

  pickImage = async () => {     
    const selectedImage = await ImagePicker.launchImageLibraryAsync({       
    mediaTypes:    ImagePicker.MediaTypeOptions.All,       
    allowsEditing: true,      
    quality:       1,     
  })     
    if (!selectedImage.cancelled) {       
      console.log(selectedImage.uri)       
      this.handleCmePic(selectedImage.uri);  
     }   
  }
}

//start




//end 

const styles = StyleSheet.create({
  textField: {
    flex:         1,
    fontFamily:   'open-sans',
    height:       60,
    width:        '80%',
    textAlign:    'center',
    alignSelf:    'center',
    borderColor:  'gray',
    borderWidth:  2,
    borderRadius: 30,
    margin:       8,
  },
  header: {
    flex:       1,
    fontSize:   20,
    fontFamily: 'open-sans',
    textAlign:  'center',
    alignSelf:  'center',
    width:      '80%',
  },
  text: {
    fontFamily: 'open-sans',
    textAlign:  'center',
    color:      'white',
  },
  addCmeButton: {
    marginTop:       10,
    alignSelf:       'center',
    padding:         10,
    width:           250,
    backgroundColor: Colors.primaryColor,
    borderRadius:    30,
  },
  cmeItem: {
    flex:       1,
    fontSize:   14,
    fontFamily: 'open-sans',
    textAlign:  'center',
    alignSelf:  'center',
    width:      '50%',
  },
})