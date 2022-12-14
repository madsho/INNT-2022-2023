//IMPORTS
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, getAuth } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { getDatabase, ref, set  } from 'firebase/database'

//IMPOR firebaseApp FROM FIREBASE SETUP-FILE
import firebaseApp from '../firebase'
const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)

//IMPORT COLORS
import { COLORS } from "../themes.js";
const {PRIMARY_COLOR, SECONDARY_COLOR} = COLORS

//LOGO
//https://editor.freelogodesign.org/en/logo/edit/ed124eaa4a194d558e40c37325f117ba
import logo from "../assets/LOGO.png"

//LOGIN SCREEN
const LoginScreen = () => {


    //USESTATES
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState(null)
    const [checked, setChecked] = useState(false)

    const [newUser,setNewUser] = useState({})

    //Imports navigation
    const navigation = useNavigation()

    //CHECKS FOR LOGGED IN
    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) { //IF THE USER IS LOGGED IN
                navigation.replace("TabNavigator", { screen: 'Home' }) //GO TO TABNAVIGATOR AND THEN Home SCREEN
            }
            setChecked(true)
            return unsubscribe //STOPS CHECKING FOR LOGGED IN
        });

    }, []);

    //SIGN UP FUNCTION
    //https://firebase.google.com/docs/auth/web/password-auth
    function handleSignUp(){


        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            setNewUser(user)
            const UID = user.uid

            //onsole.log(user.uid);
            //console.log(user.email);

            //Creates til user in Firebase Realtime Database
            try {
                set(ref(db, `/Users/${UID}`), {
                    email: user.email,
                });

                console.log("SAVED in RealTimeDatabase");

                navigation.replace("Profile", { UID }) //Navigates to Profile Screen, with the UID

            } catch (error) {
                console.log(`Error: ${error.message}`);
            }

            setNewUser(initialState)

            setErrorMsg(null)

            console.log("Sign up - SUCCESS - with user: " + user.email);


        })
        .catch((error) => {
            setErrorMsg(error.message)
        })

    };

    //LOG IN FUNCTION
    //https://firebase.google.com/docs/auth/web/password-auth
    function handleLogIn(){

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        
            setErrorMsg(null)

            console.log("Log in - SUCCESS - with user: " + user.email);

        })
        .catch((error) => {
            setErrorMsg(error.message)
        })

    };


    //Until the app has checked wether the user is logged in or not, it will show a loading circle (Activity indicator)
    if (!checked) {
        
        return (
            <SafeAreaView style={styles.container}>

                <ActivityIndicator size="large" />

            </SafeAreaView>

        )

    } else {
        //MAIN RETURN WITH LOGIN AND SIGN UP
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Image source={logo} width="100" height="100"></Image>
                </View>

                <View style={styles.logInContainer}>

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.input} placeholder={"Email"} onChangeText={(email) => setEmail(email)} value={email}/>
                        <TextInput style={styles.input} secureTextEntry placeholder={"Password"} onChangeText={(password) => setPassword(password)} value={password}/>
                    </View>

                    {errorMsg && (

                        errorMsg === "Firebase: Error (auth/invalid-email)." ? (<Text style={styles.errorMsg}>Please type a valid email</Text>) :
                        errorMsg === "Firebase: Error (auth/internal-error)." ? (<Text style={styles.errorMsg}>Please type a password</Text>) :
                        errorMsg === "Firebase: Password should be at least 6 characters (auth/weak-password)." ? (<Text style={styles.errorMsg}>Password must be at least 6 characters</Text>) :
                        errorMsg === "Firebase: Error (auth/user-not-found)." ? (<Text style={styles.errorMsg}>Wrong email</Text>) : 
                        errorMsg === "Firebase: Error (auth/wrong-password)." ? (<Text style={styles.errorMsg}>Wrong password</Text>) : 
                        <Text style={styles.errorMsg}>ERROR: {errorMsg}</Text>

                    )}
                    
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity style={styles.signUpButton} onPress={() => handleSignUp()}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity style={[styles.signUpButton, styles.logInButton]} onPress={() => handleLogIn()}>
                            <Text style={styles.logInText}>Log In</Text>
                        </TouchableOpacity>

                    </View>

                </View>



            </KeyboardAvoidingView>

        )

    }

}

export default LoginScreen

//STYLING
const styles = StyleSheet.create({
    buttonContainer: {
        width: "60%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    container: {
        flex: 1,
        backgroundColor: SECONDARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    errorMsg: {
        color: "#FF0000",
        fontWeight: "bold",
        padding: 10
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
        width: "80%"
    },
    logInContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    logInButton:{
        backgroundColor: SECONDARY_COLOR,
        marginTop: 5,
        borderColor: PRIMARY_COLOR,
        borderWidth: 2,
        alignItems: "center"
    }, 
    logInText:{
        color: PRIMARY_COLOR,
        fontWeight: "700",
        fontSize: 16
    },
    signUpButton: {
        backgroundColor: PRIMARY_COLOR,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center"
    },
    signUpText:{
        color: SECONDARY_COLOR,
        fontWeight: "700",
        fontSize: 16
    },
    titleContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
})
