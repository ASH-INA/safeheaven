import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, DatePickerAndroid } from 'react-native';
import { auth, firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import styles from '../components/styles';

const ProfessionalChatScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState();
  const [userData, setUserData] = useState({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);

  const currentUser = auth.currentUser;
  const isProfessional = currentUser.uid === id;

  const fetchUserDetails = async () => {
    if (currentUser) {
      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username); 
        }
      } catch (error) {
        Alert.alert('Error fetching user details: ', error.message);
      }
    }
  };

  const fetchProfessionalDetails = async () => {
    if (currentUser) {
      try {
        const userRef = doc(firestore, 'users', id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        Alert.alert('Error fetching user details: ', error.message);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchProfessionalDetails();
    const q = query(
      collection(firestore, 'chats'),
      where(isProfessional ? 'receiverID' : 'senderID', '==', currentUser.uid), // Show messages for professional or user based on current user
      where(isProfessional ? 'senderID' : 'receiverID', '==', id) // Show messages with the other party (user or professional)
    );
    // const q = query(
    //   collection(firestore, 'chats'),
    //   where('professionalId', '==', id),
    //   where('senderID', 'in', [currentUser.uid, id]),
    //   where('receiverID', 'in', [currentUser.uid, id])
    // );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map(doc => doc.data());
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [id]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(firestore, 'chats'), {
        professionalId: id,
        text: newMessage,
        senderID: currentUser.uid,
        receiverID: id,
        timestamp: Timestamp.now(),
        senderName: username || 'Anonymous', 
        professionalName: userData.username,
      });
      setNewMessage('');
    } catch (error) {
      alert('Error sending message.');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    setAppointmentDate(date);
    hideDatePicker();
  };

  const scheduleAppointment = async () => {
    if (!appointmentDate) {
      alert('Please select a date and time for your appointment.');
      return;
    }

    if (appointmentDate < Timestamp.now()){
      alert('Please select a future date.');
      return;
    }

    setLoading(true)

    try {
      await addDoc(collection(firestore, 'appointments'), {
        professionalId: id,
        professionalName: userData.username,
        userId: currentUser.uid,
        timestamp: Timestamp.now(),
        date: appointmentDate,
      });
      setLoading(false);
      alert(`Appointment scheduled with ${userData.username} for ${appointmentDate}`);
    } catch (error) {
      setLoading(false);
      alert('Error scheduling appointment. Please try again.', error.message);
    }
  };

  const renderMessageItem = ({ item }) => {
    // Check if the message was sent by the current user
    const isCurrentUser = item.senderID === currentUser.uid;
  
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
        ]}
      >
        {!isCurrentUser && <Text style={styles.senderName}>{item.senderName || "Anonymous"}</Text>}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container1}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Image
            source={require('../assets/back.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>
        <View style={styles.headerinfo}>
          <View style={styles.groupinfo}>
            <Text style={styles.groupname}>{userData.username}</Text>
            <Text style={styles.groupdescription}>{userData.specialty}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={showDatePicker}>
          <Image
            source={require('../assets/book.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        // inverted // To display the latest messages at the bottom
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      
      {appointmentDate && (
        <View style={styles.appointmentInfo}>
          <Text>Appointment Date: {appointmentDate.toLocaleString()}</Text>
        </View>
      )}

      <TouchableOpacity onPress={scheduleAppointment} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? 'Booking...' : 'Book Appointment'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfessionalChatScreen;
