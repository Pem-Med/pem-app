"use strict";
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//const env = functions.config();
const algoliasearch = require('algoliasearch');
const client = algoliasearch(functions.config().algolia.appid, functions.config().algolia.adminkey);
exports.indexCategories = functions.database.ref('categories/{title}').onWrite(event => {
    const index = client.initIndex('med_Categories');
    const title = event.params.title;
    const data = event.data.val();
    data['objectID'] = title;
    return index.saveObject(data, (err, content) => {
        if (err)
            throw err;
        console.log('Category Updated in Algolia index', data.objectID);
    });
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map