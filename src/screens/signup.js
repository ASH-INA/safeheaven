import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import styles from '../components/styles';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setusername] = useState();
  const [role, setRole] = useState('victim');
  const [authCode, setAuthCode] = useState('');
  const [specialty, setSpecialty] = useState('');

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and include letters, numbers, and a special character.');
        return;
      }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    if (role === 'admin'){
      if(!authCode){
        alert('Please enter the Admin Authorization Code');
        return;
      }
      if(authCode !== '8520'){
        alert('Invalid admin Authorization code.');
      return;
      }
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {
        username: username,
      });
      // store the username and other info in Firestore
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, {
      username: username,
      email: email,
      role: role,
      specialty: specialty,
    });
      setLoading(false);
      navigation.navigate('Dashboard'); 
    } catch (error) {
      setLoading(false);
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Empowering you to connect, heal, and share your story.</Text>
      
      <TextInput 
        style={[styles.input, styles.inputField]} 
        placeholder="Username" 
        value={username}
        onChangeText={setusername}
        // keyboardType="email-address"
      />
      <TextInput 
        style={[styles.input, styles.inputField]} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput 
        style={[styles.input, styles.inputField]} 
        placeholder="Password" 
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput 
        style={[styles.input, styles.inputField]} 
        placeholder="Confirm Password" 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Picker
        selectedValue={role}
        style={[styles.input, styles.inputField]}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Assault Victim" value="victim" />
        <Picker.Item label="Legal Assistant" value="professional" />
        <Picker.Item label="System Admin" value="admin" />
      </Picker>

      {/* Show specialty input only if user is a Legal Assistant */}
      {role === 'professional' && (
        <TextInput
          style={[styles.input, styles.inputField]}
          placeholder="Specialty (e.g., Family Law)"
          value={specialty}
          onChangeText={setSpecialty}
        />
      )}

      {/* Show Code input only if user is a System Admin */}
      {role === 'admin' && (
        <TextInput
          style={[styles.input, styles.inputField]}
          placeholder="Admin Authorization Code"
          value={authCode}
          onChangeText={setAuthCode}
        />
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.text}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;
