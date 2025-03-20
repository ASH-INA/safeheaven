import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../config/firebaseConfig';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import styles from '../components/styles';
import { auth } from '../config/firebaseConfig';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  const fetchUserDetails = async () => {
    if (currentUser) {
      try {
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setLoading(false);
        }
      } catch (error) {
          setLoading(false);
          Alert.alert('Error fetching user details: ', error.message);
        }
    }
  };

  const retrieveChatList = () =>{
    // Check if the current user is the professional assistant
    const isProfessional = currentUser && userData.role === 'professional';
    if (currentUser) {
      // const chatsQuery = query(
      //   collection(firestore, 'chats'),
      //   // If the user is a regular user (sender)
      //   where('senderID', '==', currentUser.uid), 
      // );

      const chatsQuery = query(
        collection(firestore, 'chats'),
        where(isProfessional ? 'receiverID' : 'senderID', '==', currentUser.uid)
      );
  
      const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
        const chatList = querySnapshot.docs.map((doc) => doc.data());
        
        // Group chats by professionalId to ensure unique chats
        const uniqueChats = chatList.reduce((acc, chat) => {
          const professionalId = chat.professionalId;
          if (!acc[professionalId]) {
            acc[professionalId] = chat;
          }
          return acc;
        }, {});
  
        // Optionally sort by timestamp if you want to show the latest messages first
        // setChats(Object.values(uniqueChats).sort((a, b) => b.timestamp - a.timestamp));
        setChats(Object.values(uniqueChats));
      });
  
      return () => unsubscribe();
    }
  }

  useEffect(() => {
    fetchUserDetails();
    retrieveChatList();
  }, []);

  const navigateToChat = (professionalId) => {
    navigation.navigate('ProfessionalChats', { id:professionalId });
  };

  const ispro = currentUser && userData.role === 'professional';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Chats</Text>
      { chats.length ? <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupCard}
            onPress={() => navigateToChat(item.professionalId)}
          >
            <Text style={styles.groupTitle}>
              {ispro ? item.senderName : item.professionalName}
              </Text>
            <Text style={styles.groupDescription}>Click to open chat</Text>
          </TouchableOpacity>
        )}
      />: <Text>You have no active conversations yet.</Text>}
    </View>
  );
};

export default ChatListScreen;
