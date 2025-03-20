import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import styles from '../components/styles';
import { auth, firestore } from '../config/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import fetchUserDetails from '../components/username';

const DashboardScreen = ({ navigation }) => {
  const [guestMessage, setGuestMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState();
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);

  // Function to retrieve and display groups that the user is part of
  const retrieveJoinedGroups = async () => {
    setLoading(true)
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const groupsQuery = query(collection(firestore, 'groups'), where("members", "array-contains", currentUser.uid));
      const snapshot = await getDocs(groupsQuery);

      const groupsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJoinedGroups(groupsList);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Alert.alert("Error retrieving joined groups: ", error.message);
    }
  };

  const fetchPendingAppointments = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const appointmentsQuery = query(
        collection(firestore, 'appointments'),
        where('userId', '==', currentUser.uid),
        // where('timestamp', '>=', Timestamp.now())
      );
      const snapshot = await getDocs(appointmentsQuery);

      const appointmentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingAppointments(appointmentsList);
    } catch (error) {
      Alert.alert("Error fetching pending appointments: ", error.message);
      
      console.log("Error fetching pending appointments: ", error.message);
    }
  };

  // Function to handle sign-up and link guest account to email/password account
  const linkGuestAccount = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    const credential = auth.EmailAuthProvider.credential(email, password);

    try {
      const userCredential = await currentUser.linkWithCredential(auth, credential);
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        username: username,
        email: email,
        role: 'victim',
      });
      setLoading(false);
      Alert.alert("Guest account linked to new email/password account!");
      retrieveStories(); // Re-fetch stories after linking
    } catch (error) {
      Alert.alert("Failed to link account. Please try again.", error.message);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed: ', error.message);
    }
  };

  // Notification/Alert function
  const showAlert = (message) => {
    Alert.alert(
      "Important Notification",
      message,
      [{ text: "OK" }]
    );
  };

  const navigateToGroups = () => {
    navigation.navigate('Groups');
  };

  const navigateToChatScreen = (groupId, groupName) => {
    navigation.navigate('Chats', { groupId, groupName }); 
  };

  // Go to Professional Assistance Screen
  const navigateToProfessionalAssistance = () => {
    navigation.navigate('Assistance');
  };

  // Go to AI Assistant Screen
  const navigateToAI = () => {
    navigation.navigate('AI');
  };

  const navigateToChatList = () => {
    navigation.navigate('ChatList');
  };

  useEffect(() => {
    const currentUser = auth.currentUser;

    // Check if user is anonymous (guest)
    if (currentUser && currentUser.isAnonymous) {
      setGuestMessage("You are currently browsing as a guest. Sign up to save your stories permanently!");
    }
    setUsername(fetchUserDetails());
    fetchPendingAppointments();
    retrieveJoinedGroups();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      retrieveJoinedGroups();
      fetchPendingAppointments();
    }, [])
  );

  return (
      <View style={styles.container}>
        {/* Header with User Image and Icons */}
        <View style={styles.header}>
          <Image
            source={require('../assets/menu.png')}
            style={styles.icon1}
          />
          <Text style={styles.groupTitle}>Dashboard</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => showAlert("New notifications are available!")}>
              <Image
                source={require('../assets/bell.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <Image
              source={require('../assets/user.jpg')}
              style={styles.userImage}
            />
          </View>
        </View>

        {auth.currentUser?.isAnonymous && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {guestMessage}
            </Text>
          </View>
        )}

        <Text style={styles.title}>Welcome {username || "Guest"}</Text>

        {auth.currentUser && auth.currentUser.isAnonymous && (
          <View>
            <TextInput 
              style={styles.input} 
              placeholder="Username" 
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Sign Up"
              onPress={linkGuestAccount}
              color="#4CAF50"
            />
          </View>
        )}

        {/* Group Chats Section */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem} onPress={navigateToGroups}>
            <Text style={styles.gridItemTitle}>Group Chats</Text>
            <Text style={styles.gridItemDescription}>Join or create a group to share your stories!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={navigateToProfessionalAssistance}>
            <Text style={styles.gridItemTitle}>Professional Assistance</Text>
            <Text style={styles.gridItemDescription}>Get professional support when needed.</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.groupCard} onPress={() => navigateToChatList()}>
          <Text style={styles.groupTitle}>Your Chats</Text>
          <Text style={styles.groupDescription}>View your chats</Text>
        </TouchableOpacity>

        {/* Pending Appointments Section */}
        <Text style={styles.subtitle}>Pending Appointments</Text>
        {loading ? <ActivityIndicator size="small" color="#green" /> : pendingAppointments.length > 0 ? (
          <FlatList
            data={pendingAppointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
              onPress={() => navigation.navigate('ProfessionalChats', { id: item.professionalId, name: item.professionalName, specialty: 'Professionan Assistant' })}
              style={styles.groupCard}>
                <Text style={styles.groupTitle}>{item.professionalName}</Text>
                <Text style={styles.groupDescription}>Scheduled for: {new Date(item.date.seconds * 1000).toLocaleString()}</Text>
                {/* <Text style={styles.groupDescription}>Status: {item.status}</Text> */}
              </TouchableOpacity>
            )}
          />
        ) : <Text>You have no pending appointments.</Text>}

        {/* Joined Groups Section */}
        <Text style={styles.subtitle}>Joined Groups</Text>
        {loading ? <ActivityIndicator size="small" color="#green" /> : joinedGroups.length > 0 ? (
          <FlatList
            data={joinedGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.groupCard} onPress={() => navigateToChatScreen(item.id, item.name)}>
                <Text style={styles.groupTitle}>{item.name}</Text>
                <Text style={styles.groupDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        ) : <Text>You have not joined any groups yet.</Text>}

        <Image
          source={require('../assets/grey.png')}
          style={styles.icon2}
        />

        {/* Additional Action Buttons */}
        <View style={styles.bottomContainer}>
          <Button
            title="AI Assistant"
            onPress={navigateToAI}
            color="#4CAF50"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default DashboardScreen;
