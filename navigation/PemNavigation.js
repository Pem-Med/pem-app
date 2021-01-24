import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import CategoriesScreen from '../screens/CategoriesScreen';
import ChatTabScreen from '../screens/ChatTabScreen';
import SubCategoriesScreen from '../screens/SubCategoriesScreen';
import CatContentScreen from '../screens/CatContentScreen';
import ChatroomScreen from '../screens/ChatroomScreen';
import ProfileScreen from '../screens/ProfileScreens/ProfileScreen';
import CalendarScreen from '../screens/ProfileScreens/CalendarScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import UserProfileScreen from '../screens/ProfileScreens/UserProfileScreen';
import CMEScreen from '../screens/CMEScreen';
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
import RoomScreen from '../screens/RoomScreen';
import AddRoomScreen from '../components/AddRoomScreen';


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
    AddRoom: {
      screen: AddRoomScreen,
    },
    Chatroom: {
      screen: ChatroomScreen,
    },
    Room: {
      screen: RoomScreen,
    },
    UserProfile: {
      screen: UserProfileScreen
    },
  },
  {
    navigationOptions: ({ navigation }) => {
      let tabBarVisible;

      if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
          if (route.routeName === "Chatroom") {
            tabBarVisible = false;
          } else {
            tabBarVisible = true;
          }
        });
      }

      return {
        tabBarVisible
      }
    }

  },
  {
    initialRouteName: 'Chat',
  },
  {
  }
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
    CME: CMEScreen,
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
        tabOptions: {
          activeTinColor: Colors.accentColor,
        },
      },
      {
        initialRouteName: "Home",
      }
    );

const PemNavigator = createDrawerNavigator(
  {
    Categories: {
      screen: MenuTabNavigator,
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
    TabMain: MenuTabNavigator,
  },
  {
    initialRouteName: "Login",
  }
);

export default createAppContainer(SwitchNavigator);