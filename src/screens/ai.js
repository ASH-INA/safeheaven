import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../components/styles';

const AIScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef();

  const handleSendMessage = () => {
    const userMessage = inputMessage.trim();
    if (userMessage) {
      // Add user message to the list
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setInputMessage('');

      // Simulate AI response (could be replaced by a real API later)
      setTimeout(() => {
        const aiResponse = `AI Response to: ${userMessage}`;
        
        if (userMessage.toLocaleLowerCase() === 'hello'){
          const aiResponse = 'Hey! How may I help you?'
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiResponse, sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  // Scroll to the bottom of the message list after each new message
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Assistant</Text>
      <ScrollView 
        style={{ flex: 1, marginBottom: 20 }} 
        ref={scrollViewRef} 
        onContentSizeChange={scrollToBottom} // Auto-scroll when new messages are added
      >
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.messageContainer, 
              message.sender === 'user' ? styles.currentUserMessage : styles.otherUserMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Ask me anything..."
          multiline
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AIScreen;
