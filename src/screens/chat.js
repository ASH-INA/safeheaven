import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image } from 'react-native';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, doc, getDoc } from 'firebase/firestore';
import styles from '../components/styles';
import { auth, firestore } from '../config/firebaseConfig';

const ChatScreen = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;  // Receive group info from navigation params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState();
  const [replyToMessage, setReplyToMessage] = useState('');

  const currentUser = auth.currentUser;

  const fetchUserDetails = async () => {
    const currentUser = auth.currentUser;
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

  // Fetch group messages in real-time
  useEffect(() => {
    const messagesRef = collection(firestore, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      fetchUserDetails();
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [groupId]);

  // Send a new message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      const messagesRef = collection(firestore, 'groups', groupId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderID: currentUser.uid,
        timestamp: Timestamp.now(),
        senderName: username || 'Anonymous', 
        senderAvatarUrl: currentUser.photoURL || '',
        replyTo: replyToMessage ? replyToMessage.id : null,
      });
      setNewMessage(''); 
      setReplyToMessage(null);
    } catch (error) {
      Alert.alert("Error sending message:", error.message);
    }
  };

  const handleReply = (message) => {
    setReplyToMessage(message); // Set the message to be replied to
    setNewMessage(`@${message.senderName}: `); // Pre-fill the input with the sender's name
  };

  // Render each message
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

        {/* Render the message that is being replied to, if it's a reply */}
        {item.replyTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>Replying to: {item.replyTo}</Text>
          </View>
        )}

        <Text style={styles.timestamp}>
          {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
        </Text>
        
        {/* Only show the reply button for other users' messages */}
        {!isCurrentUser && (
          <TouchableOpacity onPress={() => handleReply(item)} style={styles.replyButton}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container1}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/back.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>

        <View style={styles.headerinfo}>
          <Image
            source={require('../assets/group.png')} 
            style={styles.userImage}
          />
          <View style={styles.groupinfo}>
            <Text style={styles.groupname}>{groupName}</Text>
            <Text style={styles.groupdescription}>Active participants: 20</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Options')}>
          <Image
            source={require('../assets/menu.png')}
            style={styles.icon1}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          // inverted // To display the latest messages at the bottom
        />
      )}

      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          style={styles.chatInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
