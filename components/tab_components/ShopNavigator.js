//IMPORTS
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native'

//IMPORT SCREENS
import ListScreen from "./ShopScreens/ListScreen";
import MapScreen from "./ShopScreens/MapScreen";

//IMPORT COLORS
import { COLORS } from "../../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, QUATERNARY_COLOR} = COLORS


//CREATING THE STACK
const Stack = createNativeStackNavigator();

const ShopNavigator = () => {

  //Imports navigation
  const navigation = useNavigation()
  const route = useRoute();

  function handleChange(param){
    navigation.replace(param)
  };


  return (

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}> 

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.bigButton} onPress={() => {handleChange("List")}}>
          <Text style={styles.bigButtonText}>List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButton} onPress={() => {handleChange("Map")}}>
          <Text style={styles.bigButtonText}>Map</Text>
        </TouchableOpacity>


      </View>

      <View style={styles.contentContainer}>

        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name="Map" component={MapScreen} />
          <Stack.Screen options={{headerShown:false}} name="List" component={ListScreen} />
        </Stack.Navigator>

      </View>

    </KeyboardAvoidingView>





  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: SECONDARY_COLOR,
    paddingTop: "5%"
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "red",
    flexDirection: "row"
  },
  contentContainer: {
    flex: 8,
    //backgroundColor: "yellow",
    width: "100%"
  },
  bigButton: {
    backgroundColor: PRIMARY_COLOR,
    width: "40%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  bigButtonText:{
    color: SECONDARY_COLOR,
    fontWeight: "700",
    fontSize: 16,
  }
})


export default ShopNavigator;