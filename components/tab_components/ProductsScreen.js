//IMPORTS
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, View, ActivityIndicator, Image} from 'react-native'
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { getDatabase, ref, onValue } from 'firebase/database'

//IMPORT COLORS
import { COLORS } from "../../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, QUATERNARY_COLOR} = COLORS


//IMPORT firebaseApp
import firebaseApp from '../../firebase'
const db = getDatabase(firebaseApp)



//SEARCH SCREEN
const ProductsScreen = () => {

  //USESTATES
  const [errorMessage, setErrorMessage] = useState(null);
  const [products, setProducts] = useState({});
  const [checked, setChecked] = useState(false);
  

  useEffect(() => {

    try {
      
      onValue(ref(db, `/Products`), (snapshot) => {

        const data = snapshot.val();

        var result = []

        for(var i in data){
          result.push([i, data[i]])
        }

        //console.log(result);

        setProducts(result)

        setChecked(true)

        //console.log(data);

      });

    } catch (error) {
     
      setErrorMessage(error);
      console.log(errorMessage);

    }

  }, [])



  //Until the app has gotten the data, it will show a loading circle (Activity indicator)
  if (!checked) {
        
    return (
        <KeyboardAvoidingView style={styles.container}>

            <ActivityIndicator size="large" />

        </KeyboardAvoidingView>

    )

  } else {

    //RETURN
    return (
      <View style={styles.container}>
        
        <View style={styles.contentContainer}>


          <ScrollView contentContainerStyle={styles.scrollView} bounces={true}>

            {
              Array.isArray(products)
              ? products.map((product, index) => {
                return(
                    <SafeAreaView style={styles.productContainer} key={index}>
                      <SafeAreaView style={styles.imageContainer}>

                        <Image 
                          style={styles.productImage}
                          source={{
                            uri: `${product[1].img}`,
                          }}
                        />

                      </SafeAreaView>

                      <SafeAreaView>

                          <Text style={styles.productTextTitle}>{product[1].product_name}</Text>
                          <Text style={styles.productText}>Price: {product[1].price}</Text>
                          <Text style={styles.productText}>Amount left: {product[1].amount}</Text>
                          <Text style={styles.productText}>Expiry date: {product[1].expiry_date}</Text>

                      </SafeAreaView>

                    </SafeAreaView>
                )
            }) : null}

          </ScrollView>

      </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.buttonContainer}>
            
          <TextInput style={styles.input} placeholder={`Product name here`}/>

          <TouchableOpacity style={styles.logOutButton} onPress={() => {console.log("TEST");}} >
            <Text style={styles.logOutText}>Search</Text>
          </TouchableOpacity>

          
        </KeyboardAvoidingView>


      </View>
    )


  }

}




export default ProductsScreen

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
      flex: 8,
      //backgroundColor: "yellow",
      width: "100%"
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
    productContainer: {
      backgroundColor: TERTIARY_COLOR,
      width: "80%",
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      flexDirection: "row"
    },
    productText: {
      color: QUATERNARY_COLOR,
      fontWeight: "600"
    },
    productTextTitle: {
      fontSize: 20,
      fontWeight: "700",
      textTransform: "capitalize"
    },
    scrollView: {
      width: "100%",
      alignItems: "center",
      //backgroundColor: "green",
      marginTop: "10%"
    },
    productImage: {
      height: 70,
      width: 70
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingRight: 5
    }
})