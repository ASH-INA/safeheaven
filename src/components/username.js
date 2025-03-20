import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';


const fetchUserDetails = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const userRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return (userDoc.data().username.toString()); 
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  }
};

  export default fetchUserDetails;