//IMPORTS
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native'
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';

//IMPORT COLORS
import { COLORS } from "../../themes.js";
import { TextInput } from 'react-native-gesture-handler';
const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, QUATERNARY_COLOR} = COLORS

//GOOGLE MAPS API KEY AND URL-BASE
//const API_KEY = 'AIzaSyAgVKBlvrGi8Bk3X63q7NEWyHX3UllDrE0';
const API_KEY = 'AIzaSyBQeOKGnEHgTHLWsuYcWpCJnzMbMGU_hOI';
const url_places_BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';


//SEARCH SCREEN
const SearchScreen = () => {

  //USESTATES
  const [errorMessage, setErrorMessage] = useState(null);
  const [coords, setCoords] = useState("");
  const [shops, setShops] = useState({});
  const [radius, setRadius] = useState(1500);
  const [sorting, setSorting] = useState(true);
  const [opennow, setOpennow] = useState(true);

  //Loading Coords when screen is loaded
  useEffect(()=>{
    loadCoords()
    //console.log("LoadCoords running...");
  }, []);


  //ASYNC funtion to load coords
  async function loadCoords(){
    try {
      
      //Checking if permission is granted
      let { status } = await Location.requestForegroundPermissionsAsync();

      if(status !== 'granted'){ //If permission ins't granted...
        setErrorMessage('Access to location is neaded to run the app');
        return;
      };

      //Gets the location (Coords) of the user
      const location = await Location.getCurrentPositionAsync();
      const {latitude, longitude} = location.coords;
      const latlng = latitude + ',' + longitude;
      console.log("Loaded Coords - SUCCESS");
      setCoords(latlng) //SETS THE COORDS USESTATE TO THE USERS COORDS

    } catch (error) {
      alert(errorMessage);
    };

  };


  //ASYNC funtion to get a place from user coords via GoogleMapsPlatform and the Places API
        //https://rajatamil.medium.com/how-to-get-data-from-google-maps-places-api-7eaa40dfd617
        //https://developers.google.com/maps/documentation/javascript/places#find_place_from_query
        async function loadShops(){
          try {

            //THE FULL URL FOR THE PLACES API
            if(sorting){
              var url_places = `${url_places_BASE}${coords}&radius=${radius}&type=supermarket&key=${API_KEY}`
            } else {
              var url_places = `${url_places_BASE}${coords}&rankby=distance&opennow=${opennow}&type=supermarket&key=${API_KEY}`
            }
            
            const response = await fetch(url_places); //FETCH
            const data = await response.json(); //JSON-RESPONSE
      
            if(response.ok){ //If response is OK... (200)
              const { results } = data;
              //console.log(results);
              console.log("Loaded Shops - SUCCESS");
              setShops(results) //SET SHOPS TO THE RESULTS
      
            } else {
              setErrorMessage(data.error_message);
            };
      
          } catch (error) {
            console.log(errorMessage);
          };
        };



  //RETURN
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>


        <ScrollView contentContainerStyle={styles.scrollView} bounces={true}>

              {
                Array.isArray(shops)
                ? shops.map((shop, index) => {
                  return(
                      <SafeAreaView style={styles.shopContainer} key={index}>
                          <Text style={styles.shopTextTitle}>{shop.name}</Text>
                          <Text style={styles.shopText}>Address: {shop.vicinity}</Text>
                          <Text style={styles.shopText}>Number of user ratings: {shop.user_ratings_total}</Text>
                          <Text style={styles.shopText}>Total rating: {shop.rating}/5</Text>

                      </SafeAreaView>
                  )
              }) : null}
              
          </ScrollView>

      </KeyboardAvoidingView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.buttonContainer}>
          
        <TouchableOpacity
          style={styles.logOutButton}
          onPress={() => { coords ? loadShops() : alert("Try again")}} 
        >
          <Text style={styles.logOutText}>Load Shops</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
  
          {sorting ? (

              <TextInput style={styles.input} placeholder={`Radius: ${radius}`} maxLength={4} defaultValue={radius} keyboardType="number-pad" onChangeText={(value) => setRadius(value)}/>
          
            ) : (

              <TouchableOpacity style={styles.sortingButton} onPress={() => { setOpennow(!opennow)}}>
                <Text style={styles.sortingText}>{opennow ? "Open" : "Closed"}</Text>
              </TouchableOpacity>

            )

          }

          <TouchableOpacity style={styles.sortingButton} onPress={() => { setSorting(!sorting)}}>
            <Text style={styles.sortingText}>Sort by: {sorting ? "Relevance" : "Distance"}</Text>
          </TouchableOpacity>
  
        </KeyboardAvoidingView>
        

        {/*<TextInput style={styles.input} placeholder={`Radius: ${radius}`} onChangeText={(radius) => setRadius(radius)} value={radius}/>*/}

      </KeyboardAvoidingView>


    </KeyboardAvoidingView>
  )
}

export default SearchScreen

//STYLES
const styles = StyleSheet.create({
    buttonContainer: {
      flex: 2,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      //backgroundColor: "red"
    },
    container: {
      flex: 1,
      backgroundColor: SECONDARY_COLOR,
      alignItems: 'center',
      width: "100%"
    },
    contentContainer: {
      flex: 7,
      //backgroundColor: "yellow",
      width: "100%",
      paddingTop: "10%"
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        borderColor: PRIMARY_COLOR
    },
    inputContainer: {
      //backgroundColor: "lightblue",
      width: "100%",
      flexDirection:'row',
      justifyContent: "center"
    },
    logOutButton: {
        backgroundColor: PRIMARY_COLOR,
        width: "60%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },
    logOutText:{
        color: SECONDARY_COLOR,
        fontWeight: "700",
        fontSize: 16,
    },
    shopContainer: {
      backgroundColor: TERTIARY_COLOR,
      width: "80%",
      padding: 15,
      borderRadius: 10,
      marginTop: 20
    },
    shopText: {
      color: QUATERNARY_COLOR,
      fontWeight: "600"
    },
    shopTextTitle: {
      fontSize: 20,
      fontWeight: "700",
      textTransform: "capitalize"
    },
    scrollView: {
      width: "100%",
      alignItems: "center",
      //backgroundColor: "green"
    },
    sortingButton: {
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
    sortingText: {
      color: SECONDARY_COLOR,
      fontWeight: "500",
      fontSize: 14,
    }
})