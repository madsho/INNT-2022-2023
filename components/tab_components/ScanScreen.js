//IMPORTS
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

//IMPORT COLORS
import { COLORS } from "../../themes.js";
import { SafeAreaView } from 'react-native-safe-area-context';
const {PRIMARY_COLOR, SECONDARY_COLOR} = COLORS

//SCAN SCREEN
const ScanScreen = () => {

  //USESTATES
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  //Gets permission to use barcode scanner - Uses the BarCodeScanner module
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  //When barcode is scanned...
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(data);
  };

  //Awaiting permission
  if (hasPermission === null) {
    return (

      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>

    )
  }

  //If permission isn't granted
  if (hasPermission === false) {
    return <Text style={styles.buttonText}>No access to camera</Text>;
  }

  //RETURN
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? null : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setScanned(false)} >
            <Text style={styles.buttonText}>Scan again</Text>
          </TouchableOpacity>
        </View>
        )
      }
        
    </View>
  );




}

export default ScanScreen

//STYLES
const styles = StyleSheet.create({
    button: {
      backgroundColor: PRIMARY_COLOR,
      width: "100%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center"
    },
    buttonContainer: {
      width: "80%",
      //backgroundColor: "azure",
      marginTop: "auto",
      bottom: 30
    },
    buttonText:{
        color: SECONDARY_COLOR,
        fontWeight: "700",
        fontSize: 16
    },
    container: {
      flex: 1,
      backgroundColor: "black",
      alignItems: 'center',
      justifyContent: 'center',
      width: "100%"
    },
    header: {
      fontWeight: "700",
      fontSize: 20,
      color: PRIMARY_COLOR
    }
})