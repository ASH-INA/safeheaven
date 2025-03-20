import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import styles from '../components/styles';
import { firestore, auth } from '../config/firebaseConfig';

const JourneyShareScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShareStory = async () => {
    if (!title || !body) {
      Alert.alert("Error", "Please fill in both title and body of the story");
      return;
    }

    setLoading(true);
    try {
      // const auth = getAuth();

      const currentUser = auth.currentUser;
      
      // Check if the user is anonymous
      const isAnonymous = currentUser.isAnonymous;

      // Add the story to Firestore
      const storyData = {
        title,
        body,
        createdAt: serverTimestamp(),
        userId: currentUser.uid, // Use the current user's UID (anonymous or signed-in)
        userType: isAnonymous ? 'guest' : 'authenticated',
      };

      // Upload the story to Firestore
      await addDoc(collection(firestore, 'stories'), storyData);
      setLoading(false);
      Alert.alert("Success", "Story shared successfully!");

      navigation.navigate('Dashboard');
    } catch (error) {
      setLoading(false);
      console.log(error)
      Alert.alert("Error", "There was a problem sharing the story.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Story</Text>
      <TextInput
        style={styles.input}
        placeholder="Story Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 150 }]} // For longer text input
        placeholder="Write your story here..."
        value={body}
        onChangeText={setBody}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleShareStory}>
        <Text style={styles.buttonText}>{loading ? 'Sharing...' : 'Share Story'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JourneyShareScreen;
