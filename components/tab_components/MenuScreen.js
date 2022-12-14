//IMPORTS
import { StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getAuth, signOut } from "firebase/auth"
import { getDatabase, ref, onValue } from 'firebase/database'

//IMPORT firebaseApp
import firebaseApp from '../../firebase'
const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)

//IMPORT COLORS
import { COLORS } from "../../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, QUATERNARY_COLOR} = COLORS

//MENUSCREEN
const MenuScreen = () => {

  //USESTATE W. ERRORMSG
  const [errorMsg, setErrorMsg] = useState(null)
  const [user, setUser] = useState({})
  const [checked, setChecked] = useState(false)

  //Imports Navigation
  const navigation = useNavigation()

  //WHEN THE SCREEN IS LOADED THE DATA FROM THE CURRENT LOGGED IN USER IS LOADED FROM THE RTD 
  useEffect(() => {

    const currentUser = auth.currentUser
    const uid = currentUser.uid //Gets the UID from the current logged in user

    //The data from the RTD is loaded
    if(uid) {

      //console.log(uid);

      onValue(ref(db, `/Users/${uid}`), (snapshot) => {

        const data = snapshot.val();

        setUser(data)

        setChecked(true)
        //console.log(user);

        });

    }

  }, [])


  //LOG OUT
  function handleLogOut(){
      
    Alert.alert("Log out?", "You sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", 
          onPress: () => {
        
            signOut(auth)
            .then(() => {

              console.log("Log out - SUCCESS");
              navigation.replace("Login") //NAVIGATES TO LOGIN SCREEN
            
            })
            .catch((error) => {
              setErrorMsg(error.message)
              console.log(errorMsg);
              alert(errorMsg)
            });

          } 
        }
      ]
    );

  }

  //HANDLEEDIT() FUNCTION ---> CURRENTLY WITHOUT FUNCTIONALITY
  // FUTURE FUNCTIONALITY == the user is sent to the profile screen, with this route --> this is recognized and the user can edit their data
  function handleEdit(){

    console.log("EDIT IS NOT IMPLEMENTED");
    Alert.alert("Editing is not implemented yet...")

  };

  //Until the app has gotten the data, it will show a loading circle (Activity indicator)
  if (!checked) {
        
    return (
        <KeyboardAvoidingView style={styles.container}>

            <ActivityIndicator size="large" />

        </KeyboardAvoidingView>

    )

  } else {
 
    //MAIN RETURN WITH DATA AND BUTTONS
    return (
      <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>

        <KeyboardAvoidingView style={styles.contentContainer}>
    
          <Text style={styles.data}>Email: {user.email}</Text>
          <Text style={styles.data}>Name: {user.name}</Text>
          <Text style={styles.data}>Age: {user.age}</Text>
          <Text style={styles.data}>Gender: {user.gender}</Text>
          <Text style={styles.data}>Address: {user.address}</Text>

        </KeyboardAvoidingView>

        <KeyboardAvoidingView style={styles.buttonContainer}>
        
        <TouchableOpacity style={[styles.logOutButton ,styles.editButton]} onPress={() => {handleEdit()}}>
            <Text style={styles.editText}>Edit user</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logOutButton} onPress={() => {handleLogOut()}}>
            <Text style={styles.logOutText}>Log out</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        

      </KeyboardAvoidingView>
    )


  }

}

export default MenuScreen

//STYLES
const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "azure"
  },
  container: {
    flex: 1,
    backgroundColor: SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  contentContainer: {
    flex: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
    //backgroundColor: "lightblue"
  },
  data: {
    fontWeight: "600",
    fontSize: 18,
    color: QUATERNARY_COLOR,
    marginBottom: 10
  },
  editButton:{
    backgroundColor: SECONDARY_COLOR,
    marginTop: 5,
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    alignItems: "center"
  }, 
  editText:{
    color: PRIMARY_COLOR,
    fontWeight: "700",
    fontSize: 16
  },
  header: {
    fontWeight: "700",
    fontSize: 20
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
  }
})