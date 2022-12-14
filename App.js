//IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//MAIN SCREENS
import LoginScreen from './components/LoginScreen';
import TabNavigator from './components/TabNavigator';
import ProfileScreen from './components/ProfileScreen';

//LOGBOX - Yellow Warnings Disabling in App
      import { LogBox } from 'react-native';
      // Ignore log notification by message
      LogBox.ignoreLogs(['Warning: ...']);
      //Ignore all log notifications
      LogBox.ignoreAllLogs();


//CREATING THE STACK
const Stack = createNativeStackNavigator();

//MAIN APP CONSISTING OF 2 STACK SCREENS
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
        <Stack.Screen options={{headerShown:false}} name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}