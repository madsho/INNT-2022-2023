//IMPORTS
import { StyleSheet, Text, TouchableOpacity, View, Alert, KeyboardAvoidingView, TextInput, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getDatabase, ref, set, onValue } from 'firebase/database'

//IMPORT firebaseApp
import firebaseApp from '../firebase'
const db = getDatabase(firebaseApp)

//IMPORT COLORS
import { COLORS } from "../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR} = COLORS

//MENUSCREEN
const ProfileScreen = ({navigation, route}) => {

    var initialState = {email: '', fullName: '', age: '', gender: '', address: ''} //Setting the initial state

    const [user, setUser] = useState({})
    const [uid, setUid] = useState(route.params.UID) //Getting the UID from the route parameters

    //When the screen is loaded, the email from the RealTimeDB is loaded
    useEffect(() => {
        if(uid) {

            //console.log(uid);

            onValue(ref(db, `/Users/${uid}`), (snapshot) => {

                const data = snapshot.val();

                initialState = {email: Object.values(data)[0], fullName: '', age: '', gender: '', address: ''}
                setUser(initialState)

                });

        }
    },[]);

    //FUNCTION TO HANDLE SAVE
    function handleSave(){

        //console.log(user);

        var { email, fullName, age, gender, address} = user //Gets the data from the user

        if(!user.fullName || !user.age || !user.gender || !user.address) {
            Alert.alert("Please fill out all fields!")
        } else {

            //TRY/CATCH TO SET (SAVE) THE TYPED DATA IN THE RealTimeDB 
            try {

                set(ref(db, `/Users/${uid}`), {
                    email: email,
                    name: fullName,
                    age: age,
                    gender: gender,
                    address: address
                });


                navigation.navigate("TabNavigator", { uid }, { screen: 'Home' });

                console.log("Profile data saved");

            } catch (error) {
                console.log(`Error: ${error.message}`);
            }


        }

    }


    //IF THERE IS NO USER
    if (!user) {
        return <Text>No data</Text>;
    } else {
      
      //MAIN RETURN WITH INPUT FIELDS AND SAVE BUTTON
      return (
        
        <View style={styles.container}>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>Welcome to FoodSaver!</Text>
                <Text style={styles.description}>Create a profile by filling out the form</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                    <Text style={styles.description}>Name</Text>
                    <TextInput style={styles.input} placeholder={`Your name here`} onChangeText={(text) => user.fullName = text}/>
                </KeyboardAvoidingView>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                    <Text style={styles.description}>Age</Text>
                    <TextInput style={styles.input} placeholder={`Your age here`} keyboardType="number-pad" onChangeText={(text) => user.age = text}/>
                </KeyboardAvoidingView>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                    <Text style={styles.description}>Gender</Text>
                    <TextInput style={styles.input} placeholder={`Your gender here`} onChangeText={(text) => user.gender = text}/>
                </KeyboardAvoidingView>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
                    <Text style={styles.description}>Address</Text>
                    <TextInput style={styles.input} placeholder={`Your address here`} onChangeText={(text) => user.address = text}/>
                </KeyboardAvoidingView>


            </KeyboardAvoidingView>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.buttonContainer}>

                <TouchableOpacity style={styles.button} onPress={() => handleSave()}>
                    <Text style={styles.buttonText}>Save and continue</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>


        </View>

      )

    }



}

export default ProfileScreen


//STYLES
const styles = StyleSheet.create({
  button: {
        backgroundColor: PRIMARY_COLOR,
        width: "60%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 50
  },
  buttonText:{
        color: SECONDARY_COLOR,
        fontWeight: "700",
        fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: PRIMARY_COLOR
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    flexDirection: "row",
    //backgroundColor: "red",
    margin: 5
  },
  header: {
    fontWeight: "700",
    fontSize: 28,
    color: PRIMARY_COLOR
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  formContainer: {
    flex: 2,
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  description: {
    fontWeight: "600",
    fontSize: 18,
    color: PRIMARY_COLOR
  }
})