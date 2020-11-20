import CatContent from "../../models/catContent";

export const DELETE_CATCONTENT = 'DELETE_CATCONTENT';
export const CREATE_CATCONTENT = 'CREATE_CATCONTENT';
export const UPDATE_CATCONTENT = 'UPDATE_CATCONTENT';
export const SET_CATCONTENT = 'SET_CATCONTENT';

export const fetchCatContent = () =>{

    return async dispatch =>{
        // you can access here any async code!
       const response = await fetch('https://med-app-519aa.firebaseio.com/categories.json',{
        });
        const resData = await response.json();
        const catContentFireBaseData = [];

        for(const key in resData){
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
                ));
        }

        dispatch({type: SET_CATCONTENT, catcontent: catContentFireBaseData })
    };
};

export const deleteCatContent = (catContentId) => {
    return async dispatch =>{
        const response = await fetch(`https://med-app-519aa.firebaseio.com/categories/${catContentId}.json`,{
            method: 'DELETE',
        });
        dispatch({ type: DELETE_CATCONTENT, catContentId: catContentId });
    }
}

export const createCatContent = (title, color, subId, evaluation, signs, management, medications,references,image) => {
    return async dispatch =>{
        // you can access here any async code!
       const response = await fetch('https://med-app-519aa.firebaseio.com/categories.json',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
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
                image
            })
        });

        const resData = await response.json();
        console.log(resData);

        dispatch({
            type: CREATE_CATCONTENT, 
            catContentData:{
                id: resData.name,
                title: title,
                color: color,
                subId: subId,
                evaluation: evaluation,
                signs: signs,
                management: management,
                medications: medications,
                references: references,
                image: image
        }});
    };
};

export const updateCatContent = (id, title, evaluation, signs, management, medications, references, image) => {
    console.log('id' + id)
    return async dispatch =>{
        await fetch(`https://med-app-519aa.firebaseio.com/categories/${id}.json`,
        {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                evaluation,
                signs,
                management,
                medications,
                references,
                image
            })
        });

        dispatch({
            type: UPDATE_CATCONTENT,
            catContentId: id,
            catContentData: {
                title: title,
                evaluation: evaluation,
                signs: signs,
                management: management,
                medications: medications,
                references: references,
                image: image
            }
        });
    };
   
};