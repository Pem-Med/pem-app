import * as firebase from 'firebase';
import config from '../firebaseConfig'

class Firebase {
  constructor() {
    this.init()
    this.observeAuth()
  }
  /**
   * Initializes Firebase.
   * The if...else is used so the app won't crash
   * with an error saying "Firebase has already
   * been initialized." The initialization also runs
   * this.counter() and this.whosOnline() to set those
   * up for when people log in.
   */
  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      this.counter()
      this.whosOnline()
    } else {
      console.log('Firebase app was already initialized!')
    }
  }

  observeAuth = () => {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  _currentUser = null;
  onAuthStateChanged = user => {
    if (user != null) {
      this._currentUser = user;
      firebase.database().ref(`users/${user.uid}/profile`).update({
        online: true
      })
    } else if (this._currentUser != null) {
      firebase.database().ref(`users/${this._currentUser.uid}/profile`).update({
        online: false
      });
      
      this.removeUserFromAllThreads(this._currentUser.uid);

      this._currentUser = null;
    }
  }


  /**
   * Removes the user from any chat threads that they are a part of
   * @param {string} uid 
   */
  removeUserFromAllThreads = (uid) => {
    let threadQuery = firebase.firestore().collection('THREADS').where('members', 'array-contains', uid);

    threadQuery.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          
          const docRef = firebase.firestore().collection("THREADS").doc(doc.id);
          const thread = doc.data();

          //if chat currently has only 1 users, delete the whole thread
          if (thread.members.length === 1) {
            this.deleteThreadMessagesSubCollection(doc.id, 500)
              .then(() => {
                //delete thread document
                docRef.delete();
              })
          } else {
            //remove the user from the thread
            docRef.update({
              members: firebase.firestore.FieldValue.arrayRemove(uid)
            });
          }
        });
      })
      .catch((err) => {
        console.log('There was an error removing the user from the chats: ', err);
      });
  };


  /**
   * Initializes the user counter. This is so we know how many people are online.
   */
  counter = () => {
    firebase.database().ref('userCount').once('value').then(function (snapshot) {
      if (snapshot.val() == null) {
        firebase.database().ref('userCount').set({
          count: 0
        })
      }
    })
  }

  /**
   * Initializes onlineUsers, which will be storing a list of the users that are online.
   */
  whosOnline = () => {
    firebase.database().ref('onlineUsers').once('value').then(function (snapshot) {
      if (snapshot.val() == null) {
        firebase.database().ref('onlineUsers').set({
          onlineUsers: 0 //This isn't supposed to be a number, but I can't set it to an
          //empty array or empty object. So it'll be 0 until it gets set to
          //an object later
        })
      }
    })
  }

  /**
   * Gets the user count. If it's -9999, there's been an error with Firebase
   * getting the count.
   */
  get getUserCount() {
    let count = -9999; // Using this large number to detect if it never changes
    firebase.database().ref('userCount').on('value', function (snapshot) {
      count = snapshot.val().count;
    })
    return count;
  }

  /**
   * Sets the user count. It takes a parameter from screens where users can sign in
   * and sign out (I think LoginScreen, ChatroomScreen, and SubCategoriesScreen). If
   * the parameter is 1, that means the user is signing in and the count increments.
   * Otherwise, the user is signing out and the count decrements.
   */
  set setUserCount(num) {
    firebase.database().ref('userCount').once('value').then(function (snapshot) {
      firebase.database().ref('userCount').set({
        count: num == 1 ? snapshot.val().count + 1 : snapshot.val().count - 1
      })
    })
  }

  /**
   * Gets the list of online users.
   */
  get getOnlineUsers() {
    let onlineUsers = [];
    firebase.database().ref('onlineUsers').on('value', function (snapshot) {
      onlineUsers = snapshot.val().onlineUsers;
    })
    return onlineUsers;
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  /**
   * Gets the email of the current user.
   */
  get userEmail() {
    return (firebase.auth().currentUser || {}).email;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


  /**
 * Adds the CME info to the list.
 */

  AddCme = async (cmes) => {
    const { cert, exp, image, id } = cmes;
    const remoteUri = await this.getImageRemoteUri(image, cmes);
    firebase.database().ref(`userCmes/userId: ${firebase.auth().currentUser.uid}/cmes`)
      .push({
        cert: cert,
        exp: exp,
        image: remoteUri,
        id: id,
      })
      .then((data) => {
        console.log('data', data)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }


  getImageRemoteUri = (image, cme) => {

    const photoPath = `uploads/${firebase.auth().currentUser.uid}/${cme.id}.jpg`;

    return new Promise(async (res, rej) => {
      const response = await fetch(image);
      const file = await response.blob();
      var storageRef = firebase.storage().ref();
      let upload = storageRef.child(photoPath).put(file);
      upload.on('state_changed', snapshot => {

      }, err => {
        rej(err);

      }, async () => {
        const url = await upload.snapshot.ref.getDownloadURL();
        res(url);
      }
      )
    })
  }

  GetCmesRef = (cmes) => {
    //if list is empty
    if (!cmes) {
      return null;
    }
    return firebase.database().ref('cmes');

  }

  _deleteQueryBatch = async (db, query, resolve) => {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      this._deleteQueryBatch(db, query, resolve);
    });
  };

  /**
   * Delete all the messages for a given thread. Batch size limit is 500
   */
  deleteThreadMessagesSubCollection = async (threadId, batchSize) => {
    const db = firebase.firestore();
    const collectionRef = db.collection('MESSAGE').doc(threadId).collection('messages');
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
      this._deleteQueryBatch(db, query, resolve).catch(reject);
    });
  };

}

Firebase.shared = new Firebase()
export default Firebase
