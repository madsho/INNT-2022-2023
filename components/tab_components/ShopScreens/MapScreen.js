//IMPORTS
import React, {useState, useEffect} from 'react';
import {Button, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Text, View } from 'react-native';
import MapView, {Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";
import { useNavigation } from '@react-navigation/native'

//IMPORT COLORS
import { COLORS } from "../../../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, QUATERNARY_COLOR} = COLORS


//MAP SCREEN
function Map () {
//https://www.youtube.com/watch?v=AzjWv1X-uyg&ab_channel=TheFlutterFactory

  //USESTATES
  const [currentLocation, setCurrentLocation] = useState({latitude: 55.687241, longitude: 12.561859});  //Standard region so the maps opens
  const [shops, setShops] = useState({}); 

  //WHEN THE SCREEN IS LOADED THE APP ASKS FOR PERMISSION FOR THE GPS, AND SETS THE LOCATION TO THIS - https://docs.expo.dev/versions/latest/sdk/location/
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords)
      //console.log(currentLocation);
    })();
  }, []);


  //Get the current location. Exercise 8 /App.js lines 45-49 https://github.com/Innovationg-og-ny-teknologi-2021/8_maps_solution/blob/main/App.js
  const updateLocation = async () => {
    await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
      setCurrentLocation(item.coords) 
    } );
  };

   //Imports navigation
   const navigation = useNavigation()

   function getProducts(){

    navigation.replace("Products") 

  }


  //UPDATE
  async function update(){ //URL google api ændre alt efter personens loaktion 
    
    const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation.latitude}%2C${currentLocation.longitude}&radius=1000&type=supermarket&key=AIzaSyBQeOKGnEHgTHLWsuYcWpCJnzMbMGU_hOI`;

    //FETCH TO RETREICE THE SHOPS AROUND THE LOCATION
    fetch(URL)
      .then(data=> {

        return data.json()

      })
      .then(jsonData => {

        //console.log(jsonData.results)
        setShops(jsonData.results); //Sets the data received as the nearby shops

      })
      .catch(error=> {
        console.log(error);

      }) 
  
  }


  // Usestate for changing address 
  const [defineAddres, setDefineAddress] = useState(""); 

  //CHANGE ADDRESS
  const changeaddres = async () => {

    await Location.geocodeAsync(defineAddres).then((data) =>{

        let coordinates = data[0]//The data is an array and the coordinates are located in the first position

        setCurrentLocation(coordinates)//the location is set as the current location 
        
    }), update()//after this the new shops are recieved 

  };

    //MAIN RETURN
    return (
      <View
      //behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>

        <View style={styles.mapContainer}>

          <MapView
              style ={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              region = {{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
              }}>
      
                {Array.isArray(shops) 
               ? shops.map((shop, index) =>{
                  return(
                  <Marker key={index} coordinate={{latitude: shop.geometry.location.lat, longitude: shop.geometry.location.lng}}>  
                  <Callout onPress={()=>{getProducts()}}>
                    <View>
                      <Text>{shop.name}</Text>
                      <Text>{shop.vicinity}</Text>
                    </View>
                  </Callout>
                  </Marker>
                  )
                  }) : null}

          </MapView>     


        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.buttonContainer}>
          
          <TouchableOpacity style={styles.bigButton} onPress={() => {update()}}>
            <Text style={styles.bigButtonText}>Load Shops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallButton} onPress={updateLocation}>
            <Text style={styles.smallButtonText}>Update location</Text>
          </TouchableOpacity>

            <TextInput
              placeholder="Enter address"
              value={defineAddres}
              onChangeText={(defineAddres) => setDefineAddress(defineAddres)}
              style={styles.input}/>

          <TouchableOpacity style={styles.smallButton} onPress={() => changeaddres()}>
            <Text style={styles.smallButtonText}>Change address</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      
      
      </View>


    );
    

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: SECONDARY_COLOR,
    },
    map: {
      height: '95%'
    },
    mapContainer: {
      flex: 7,
      //backgroundColor: "yellow",
      width: "100%"
    },
    buttonContainer: {
      flex: 3,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      //backgroundColor: "red",
      padding: "5%"
    },
    bigButton: {
      backgroundColor: PRIMARY_COLOR,
      width: "60%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10
    },
    bigButtonText:{
      color: SECONDARY_COLOR,
      fontWeight: "700",
      fontSize: 16,
    },
    smallButton: {
      backgroundColor: PRIMARY_COLOR,
      alignItems: "center",
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      marginTop: 5,
      borderColor: PRIMARY_COLOR
    },
    smallButtonText: {
      color: SECONDARY_COLOR,
      fontWeight: "500",
      fontSize: 14,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 10,
      marginTop: 5,
      borderColor: PRIMARY_COLOR
    }

});

export default Map

