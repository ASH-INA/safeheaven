import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { firestore } from '../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from '../components/styles';

const ProfessionalAssistance = ({ navigation }) => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const retrieveProfessionals = async () => {

    try {
      const professionalsRef = collection(firestore, 'users');
      const q = query(professionalsRef, where('role', '==', 'professional'));

      const snapshot = await getDocs(q);
      const professionalsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfessionals(professionalsList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error retrieving professionals", error.message);
      console.log(error)
    }
  };

  useEffect(() => {
    retrieveProfessionals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professional Assistance</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.text}>{error}</Text>
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.professionalContainer}>
              <Text style={styles.cardTitle}>{item.username}</Text>
              <Text style={styles.cardBody}>Specialty: {item.specialty}</Text>
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => navigation.navigate('ProfessionalChats', { id: item.id})}
              >
                <Text style={styles.buttonText}>Chat Now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ProfessionalAssistance;
