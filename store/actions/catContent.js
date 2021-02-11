import CatContent from '../../models/catContent'
const algoliasearch = require('algoliasearch')

export const DELETE_CATCONTENT = 'DELETE_CATCONTENT'
export const CREATE_CATCONTENT = 'CREATE_CATCONTENT'
export const UPDATE_CATCONTENT = 'UPDATE_CATCONTENT'
export const SET_CATCONTENT = 'SET_CATCONTENT'

const ALGOLIA_APP_ID = "WK4HK1IJPD";
const ALGOLIA_ADMIN_KEY = "1e3fa3d043198970c9a7a5e308287b1c";
const ALGOLIA_INDEX_NAME = "med_Categories";

export const fetchCatContent = () => async (dispatch) => {
  console.log("Funcation Called")
  // you can access here any async code!
  const response = await fetch('https://med-app-519aa.firebaseio.com/categories.json', {
  })
  const resData = await response.json()
  const catContentFireBaseData = []
  const algoliaUpdated = []

  for (const key in resData) {
    catContentFireBaseData.push(new CatContent(
      key,
      resData[key].title,
      resData[key].color,
      resData[key].subId,
      resData[key].evaluation,
      resData[key].signs,
      resData[key].management,
      resData[key].medications,
      resData[key].references,
      resData[key].image,
    ))
      let data = resData[key]
      data.objectID = key
      algoliaUpdated.push(data);
  }

  var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
  var index = client.initIndex(ALGOLIA_INDEX_NAME)

  index.saveObjects(algoliaUpdated, function (err, content) {
    console.log("Pushed to Algolia Complete!")
  })


  dispatch({ type: SET_CATCONTENT, catcontent: catContentFireBaseData })
}

export const deleteCatContent = (catContentId) => async (dispatch) => {
  const response = await fetch(`https://med-app-519aa.firebaseio.com/categories/${catContentId}.json`, {
    method: 'DELETE',
  })
  dispatch({ type: DELETE_CATCONTENT, catContentId })
}

export const createCatContent = (title, color, subId, evaluation, signs, management, medications, references, image) => async (dispatch) => {
  // you can access here any async code!
  const response = await fetch('https://med-app-519aa.firebaseio.com/categories.json', {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      color,
      subId,
      evaluation,
      signs,
      management,
      medications,
      references,
      image,
    }),
  })

  const resData = await response.json()

  dispatch({
    type:           CREATE_CATCONTENT,
    catContentData: {
      id: resData.name,
      title,
      color,
      subId,
      evaluation,
      signs,
      management,
      medications,
      references,
      image,
    },
  })
}

export const updateCatContent = (id, title, evaluation, signs, management, medications, references, image) => {
  return async (dispatch) => {
    await fetch(`https://med-app-519aa.firebaseio.com/categories/${id}.json`,
      {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          evaluation,
          signs,
          management,
          medications,
          references,
          image,
        }),
      })

    dispatch({
      type:           UPDATE_CATCONTENT,
      catContentId:   id,
      catContentData: {
        title,
        evaluation,
        signs,
        management,
        medications,
        references,
        image,
      },
    })
  }
}
