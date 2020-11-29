import { CATEGORIES } from '../../data/categoriesData'
import category from '../../models/category'

const initialState = {
  categories: CATEGORIES,
}

const categoriesReducer = (state = initialState, action) => state

export default categoriesReducer
