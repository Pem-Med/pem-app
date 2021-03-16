import {Dimensions} from 'react-native';

export default {
     ScreenHeight: Math.round(Dimensions.get("window").height),
     ScreenWidth: Math.round(Dimensions.get("window").width)
};