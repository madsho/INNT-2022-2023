//IMPORTS
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//IMPORT SCREENS
import HomeScreen from "./tab_components/HomeScreen";
import ProductsScreen from "./tab_components/ProductsScreen";
import ScanScreen from "./tab_components/ScanScreen";
import MenuScreen from "./tab_components/MenuScreen";
import ShopNavigator from "./tab_components/ShopNavigator";

//IMPORT COLORS
import { COLORS } from "../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR} = COLORS

//IMPORT ICONS
import Ionicons from 'react-native-vector-icons/Ionicons'


//CREATE TAB NAVIGATOR
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    tabBarOptions={{
        activeTintColor: PRIMARY_COLOR
    }}
    screenOptions={({route}) => ({
        tabBarIcon : ({color, size}) => {

          if (route.name === 'Home') {
            return (
              <Ionicons name={'home-outline'} size={size} color={color} />
            )
          } else if (route.name === 'Menu') {
            return (
              <Ionicons name={'list-outline'} size={size} color={color} />
            )
          } else if (route.name === 'Products') {
            return (
              <Ionicons name={'ios-cart-outline'} size={size} color={color} />
            )
          } else if (route.name === 'Shops') {
            return (
              <Ionicons name={'ios-location-outline'} size={size} color={color} />
            )
          }

        },
      })}
    >
      {/*4 TAB SCREENS WHICH REDIRECTS TO THE COMPONENTS IN THE COMPONENTS FOLDER*/}
      <Tab.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
      <Tab.Screen options={{headerShown:false}} name="Products" component={ProductsScreen} />
      <Tab.Screen options={{headerShown:false}} name="Shops" component={ShopNavigator} />
      <Tab.Screen options={{headerShown:false}} name="Menu" component={MenuScreen} />

    </Tab.Navigator>
  );
};

//

export default TabNavigator;