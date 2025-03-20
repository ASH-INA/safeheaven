import firebase from '@react-native-firebase/app';

// Optional: Set up Firebase for any services you need, like Firestore or Authentication
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/login';
import Dashboard from './src/screens/dashbourd';
import LandingScreen from './src/screens/indexpage';
import PasswordReset from './src/screens/reset';
import SignupScreen from './src/screens/signup';
import JourneyShareScreen from './src/screens/share';
import Groups from './src/screens/groups';
import ProfessionalAssistance from './src/screens/assistant';
import AIScreen from './src/screens/ai';
import ChatScreen from './src/screens/chat';
import ProfessionalChatScreen from './src/screens/professionals';
import ChatListScreen from './src/screens/chatlist';

// import { app } from './src/config/firebaseConfig'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" options={{headerShown:false}} component={LandingScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title:'Sign In'}}
        />
        <Stack.Screen name="Signup" options={{headerShown:false}} component={SignupScreen} />
        <Stack.Screen name="Passwordreset" options={{title:'Reset Password'}} component={PasswordReset} />
        <Stack.Screen name="Dashboard" options={{headerShown:false}} component={Dashboard} />
        <Stack.Screen name="Share" options={{title:'Share'}} component={JourneyShareScreen} />
        <Stack.Screen name="Groups" options={{title:'Groups'}} component={Groups} />
        <Stack.Screen name="Assistance" options={{title:'Assistance'}} component={ProfessionalAssistance} />
        <Stack.Screen name="AI" options={{title:'AI'}} component={AIScreen} />
        <Stack.Screen name="ChatList" options={{title:'Chats'}} component={ChatListScreen} />
        <Stack.Screen name="Chats" options={{headerShown:false}} component={ChatScreen} />
        <Stack.Screen name="ProfessionalChats" options={{headerShown:false}} component={ProfessionalChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// android:roundIcon="@mipmap/ic_launcher_round"