import {CATEGORIES} from '../../data/categoriesData';
import category from '../../models/category';


const initialState = {
    categories: CATEGORIES,
};

const categoriesReducer = (state = initialState, action) =>{
    return state;
}

export default categoriesReducer;