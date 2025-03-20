import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { app, auth } from '../config/firebaseConfig';

// Animation Setup
const fadeAnim = new Animated.Value(0);  // Initial opacity is 0

import { getFirestore, collection, addDoc } from "firebase/firestore";
import styles from '../components/styles';

const firestore = getFirestore(app);

const LandingScreen = ({ navigation }) => {

  // Check if the user is signed in
  const user = auth.currentUser;

  // Fade-in effect
  React.useEffect(() => {
    if(user){
      navigation.navigate('Dashboard')
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Fade in over 1 second
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    // Landing Screen with background image and subtle hover effects
    <Animated.View style={[styles.heroContainer, { backgroundColor: '#f2f5f7' }]}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <View>
          <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
            Empowering Women to Heal, Share, and Connect
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
            A safe space for survivors of abuse to share their journeys and find guidance from professionals.
          </Animated.Text>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          {/* <View style={styles.footer}> */}
            <Text style={styles.footerText}>
              Your privacy is our top priority.
            </Text>
            <Text style={styles.footerText}>
              © 2025 Safe Heaven Team. All rights reserved.
            </Text>
          {/* </View> */}
        </View>
      </ImageBackground>
    </Animated.View>

  );
};

export default LandingScreen;
