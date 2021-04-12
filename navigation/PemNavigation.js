import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import CategoriesScreen from '../screens/CategoriesScreen';
import ChatTabScreen from '../screens/ChatScreens/ChatTabScreen';
import SubCategoriesScreen from '../screens/SubCategoriesScreen';
import CatContentScreen from '../screens/CatContentScreen';
import ProfileScreen from '../screens/ProfileScreens/ProfileScreen';
import CalendarScreen from '../screens/ProfileScreens/CalendarScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserProfileScreen from '../screens/ProfileScreens/UserProfileScreen';
import NewCmeScreen from '../screens/newCmeScreen'
import SearchScreen from '../screens/SearchScreen';
import AdminCategoriesScreen from '../screens/AdminScreens/AdminCategoriesScreen';
import EditCatContentScreen from '../screens/AdminScreens/EditCatContentScreen';
import AdminSubCategoriesScreen from '../screens/AdminScreens/AdminSubCategoriesScreen';
import Colors from '../constants/Colors';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import EditProfileScreen from '../screens/ProfileScreens/EditProfileScreen';
import DrawerComponent from "../components/DrawerComponent";
//import AppContainer from '../screens/ChatTabScreen'
//import SignOut from '../screens/SignOut'
import ChatRoomScreen from '../screens/ChatScreens/RoomScreen';
import AddRoomScreen from '../screens/ChatScreens/AddRoomScreen';
import AddPrivateChatScreen from '../screens/ChatScreens/AddPrivateChatScreen';
import ChatDetailScreen from '../screens/ChatScreens/ChatDetailScreen';


const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primaryColor : "",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor,
};

const LoginNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    SignUp: {
      screen: SignUpScreen,
    },
    ResetPassword: {
      screen: ResetPasswordScreen,
    },
  },
  {
    initialRouteName: "Login",
  }
);

const CatNavigator = createStackNavigator(
  {
    Categories: CategoriesScreen,
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SubCategories: {
      screen: SubCategoriesScreen,
    },
    CatContent: {
      screen: CatContentScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const ChatNavigator = createStackNavigator(

  {
    Chat: ChatTabScreen,
    Room: ChatRoomScreen,
    UserProfile: UserProfileScreen,
    ChatDetail: ChatDetailScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  },
  {
    initialRouteName: 'Chat',
  },
);

const FavNavigator = createStackNavigator(
  {
    Favorites: FavoritesScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
          size={27}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultStackNavOptions,
  }
);
const ProfileNavigator = createStackNavigator(
  {
    Profile: ProfileScreen,
    Edit: EditProfileScreen,
    CME: NewCmeScreen,
    Calendar: CalendarScreen,
  },

  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <FontAwesome name="user-md"
          size={26}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    AdminCategories: AdminCategoriesScreen,
    AdminSubCategories: AdminSubCategoriesScreen,
    EditCatContent: EditCatContentScreen,
    CatContent: CatContentScreen,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={26}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const tabScreenConfig = {
  Home: {
    screen: CatNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-home" : "ios-home"}
          color={tintColor}
          size={24}
        />
      ),
    },
  },
  Chat: {
    screen: ChatNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-chatboxes' : 'ios-chatboxes'}
          color={tintColor}
          size={24}
        />
      ),
    },
  },
};



const MenuTabNavigator =
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
      activeTinColor: "white",
      //shifting: true,
      barStyle: {
        backgroundColor: Colors.primaryColor,
      },
    })
    : createBottomTabNavigator(
      tabScreenConfig,
      {
        tabBarOptions: {
          activeTinColor: Colors.primaryColor,
          keyboardHidesTabBar: !(Platform.OS === 'ios'),
        },
      },
      {
        initialRouteName: "Home",
      }
    );

const HomeNavigator = createStackNavigator(
  {
    Home: {
      screen: MenuTabNavigator,
      navigationOptions: {
        headerShown: false
      }
    },
    AddRoom: AddRoomScreen,
    AddPrivateChat: AddPrivateChatScreen,
    UserProfileScreen: UserProfileScreen
  },
  {
    mode: 'modal',
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const PemNavigator = createDrawerNavigator(
  {
    Categories: {
      screen: HomeNavigator,
      navigationOptions: {
        drawerIcon: (drawerConfig) => (
          <Ionicons
            name={Platform.OS === "android" ? "md-star" : "ios-star"}
            size={24}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Admin: AdminNavigator,
    Profile: {
      screen: ProfileNavigator,
    },
    Favorites: {
      screen: FavNavigator,
    },
  },
  {
    contentComponent: DrawerComponent,
    contentOptions: {
      activeTinColor: Colors.primary,
    },
  },
  {}
);

const SwitchNavigator = createSwitchNavigator(
  {
    Login: LoginNavigator,
    Main: PemNavigator,
    //TabMain: MenuTabNavigator,

  },
  {
    initialRouteName: "Login",
  }
);

export default createAppContainer(SwitchNavigator);