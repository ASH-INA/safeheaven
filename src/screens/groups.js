import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import styles from '../components/styles';

const Groups = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false); // Loading state for join/leave

  const firestore = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get current logged-in user

  // Fetch Groups
  const retrieveGroups = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'groups'));
      const groupsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupsList);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Error retrieving groups");
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveGroups();
  }, []);

  // Handle Join/Leave Group with confirmation dialog
  const handleJoinLeaveGroup = (groupId, isMember) => {
    if (!currentUser) {
      // If the user is not logged in, redirect to the login page
      navigation.navigate('Signup');
      return;
    }

    Alert.alert(
      isMember ? 'Leave Group' : 'Join Group',
      `Are you sure you want to ${isMember ? 'leave' : 'join'} this group?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsJoining(true); // Start loading
            try {
              const groupRef = doc(firestore, 'groups', groupId);
              let updatedMembers = [...groups.find(group => group.id === groupId).members];

              if (isMember) {
                // If the user is a member, remove them from the group
                updatedMembers = updatedMembers.filter(member => member !== currentUser.uid);
              } else {
                // If the user is not a member, add them to the group
                updatedMembers.push(currentUser.uid);
              }

              // Update the group's members array in Firestore
              await updateDoc(groupRef, {
                members: updatedMembers,
              });

              // Refresh the groups list
              retrieveGroups();
            } catch (error) {
              Alert.alert("Error", error.message || "Error updating group");
            }
            setIsJoining(false); // End loading
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Render each group item
  const renderGroupItem = ({ item }) => {
    const isMember = item.members.includes(currentUser?.uid); // Check if the current user is a member

    return (
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>{item.name}</Text>
        <Text style={styles.groupDescription}>{item.description}</Text>

        {/* Display if the user is a member */}
        {isMember && <Text style={styles.memberBadge}>You are a member</Text>}

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinLeaveGroup(item.id, isMember)}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator size="small" color="#fff" /> // Loading indicator
          ) : (
            <Text style={styles.buttonText}>{isMember ? "Leave Group" : "Join Group"}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Group</Text>
      <Text style={styles.subtitle}>Find a support group based on your needs</Text>

      {/* Display Groups or Loading Indicator */}
      {loading ? (
        <Text style={styles.text}>Loading groups...</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
        />
      )}
    </View>
  );
};

export default Groups;
