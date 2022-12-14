//IMPORTS
import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

//IMPORT COLORS
import { COLORS } from "../../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR} = COLORS

//HOMESCREEN
const HomeScreen = () => {

  return (
    <View style={styles.container}>

      <Image style={styles.homepage} source={require('../../assets/Homepage.jpg')} />

    </View>
  )
}

export default HomeScreen

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  header: {
    fontWeight: "700",
    fontSize: 20,
    color: PRIMARY_COLOR
  },
  homepage: {
    height: "100%",
    width: "100%"
  }
})