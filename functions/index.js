const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

dotenv.config();

firebase.initializeApp({
	databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const database = firebase.database();

//const APP_ID = functions.config().algolia.app;
//const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

exports.indexCategories = functions.database.ref('/categories/{category}').onCreate(
	(data, context) => {
	const record = data.val();
	//const dataObject = {
	//	text: cat, 
//		objectID: context.params.category
//	};
	  
	record.objectID = context.params.category;
	index
	.saveObject(record)
	.then(() => {
		console.log('Firebase object indexed in Algolia', record.objectID);
		return 0;
	})
	.catch(error => {
		console.error('Error when indexing contact into Algolia', error);
		process.exit(1);
	});
});


exports.unindexCategories = functions.database.ref('/categories/{category}').onDelete(
	(snap, context) => {
	  const objectID = context.params.category;
  // Remove the object from Algolia
	return index
    .deleteObject(objectID)
    .then(() => {
      console.log('Firebase object deleted from Algolia', objectID);
	  return 0;
    })
    .catch(error => {
      console.error('Error when deleting contact from Algolia', error);
      process.exit(1);
  });
});
