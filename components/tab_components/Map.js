import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, Button, StyleSheet, View, TextInput } from 'react-native';
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat";
import MapView, { MarkerAnimated, PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker, TouchableHighlight } from 'react-native-maps';
import * as Location from 'expo-location';
import {Accuracy} from "expo-location";



//Home screen 
function Map () {
//https://www.youtube.com/watch?v=AzjWv1X-uyg&ab_channel=TheFlutterFactory

  const [currentLocation, setCurrentLocation] = useState({latitude: 55.687241, longitude: 12.561859});  //Standard region so the maps opens
  const [shops, setShops] = useState({}); 

  //Use effect https://docs.expo.dev/versions/latest/sdk/location/
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords)
      console.log(currentLocation);
    })();
  }, []);


  //Get the current location. Exercise 8 /App.js lines 45-49 https://github.com/Innovationg-og-ny-teknologi-2021/8_maps_solution/blob/main/App.js
  const updateLocation = async () => {
    await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
      setCurrentLocation(item.coords) 
    } );
  };


  async function update(){ //URL google api ændre alt efter personens loaktion 
  const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation.latitude}%2C${currentLocation.longitude}&radius=1000&type=supermarket&key=AIzaSyBQeOKGnEHgTHLWsuYcWpCJnzMbMGU_hOI`;

  fetch(URL).then(data=> {
    return data.json()
  }).then(jsonData => {
   //console.log(jsonData.results)
   setShops(jsonData.results); //Sets the data recieved as the nearby shops
  }).catch(error=> {
    console.log(error);
  }) 
  
}
// Usestate for changing address 
const [defineAddres, setDefineAddress] = useState(""); 
const changeaddres = async () => {
  await Location.geocodeAsync(defineAddres).then((data) =>{
      let coordinates = data[0]//The data is an array and the coordinates are located in the first position
      setCurrentLocation(coordinates)//the location is set as the current location 
      
  }), update()//after this the new shops are recieved 
};

    return (
      <SafeAreaView>
        <Button title='Update shops' onPress={() => {update()}}></Button>
        <Button style title="update location" onPress={updateLocation} />
            <TextInput
                placeholder="Enter address"
                value={defineAddres}
                onChangeText={(defineAddres) => setDefineAddress(defineAddres)}
                style={styles.inputField}/>
            <Button title='Change address' onPress={() => changeaddres()}/>

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
                  <Marker key={index} coordinate={{latitude: shop.geometry.location.lat, longitude: shop.geometry.location.lng}}
                  title = {shop.name}
                  description = {shop.vicinity}>
                  </Marker>
                  )
                  }) : null}

              </MapView>      
      </SafeAreaView>
    );
    

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: '5%',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },map:{
        height: '100%'
    }
});

export default Map

