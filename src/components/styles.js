import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#f2f4f7',
  },
  container1: {
    flex: 1,
    justifyContent: 'flex-start',
    // paddingHorizontal: 20,
    backgroundColor: '#f2f4f7',
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    marginBottom: 30,
    paddingHorizontal: 20
  },
  heroBackground: {
    width: '100%',
    height: '100%', 
    justifyContent: 'space-between',
    opacity: 0.8, 
  },
  appImage: {
    width: 300,
    height: 400,
    marginBottom: 30,
  },
  icon2: {
    width: '100%',
    height: 100,
    marginBottom: 30,
  },
  footerText: {
    padding: 5,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2e8b57',
    marginTop: 20,
  },loginContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center', 
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  link: {
    fontSize: 16,
    color: '#2e8b57', 
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
  // Icon Container Style
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  groupCard: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 3,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  groupDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  // Card Styling for Stories and Group Cards
  card: {
    backgroundColor: '#ffffff', // White card
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardBody: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2e8b57',  
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
  customButton: {
    backgroundColor: '#2e8b57',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 5,
  },
  // Guest Message for anonymous users
  guestMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935', // Red color for alerting
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  // Grid Items (Buttons)
  gridItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    width: '48%',  // Adjust for a 2-item row
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Shadow on Android
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  gridItemDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  // Banner for Guest Users (Sign-up Prompt)
  banner: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
    margin: 10,
  },
  icon1: {
    width: 25,
    height: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 25, // Circular user image
  },
  messageContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexWrap: 'wrap',
  },  
  chatInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },  
  bottomContainer: {
    position: 'absolute', 
    left: 15,
    right: 15,
    bottom: 0,
    // paddingVertical: 20,
    elevation: 5,
  },
  currentUserMessage: {
    alignSelf: 'flex-end', 
    backgroundColor: '#e1ffe1',
    borderRadius: 15,
    marginLeft: 20,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0', 
    borderRadius: 15,
    marginRight: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    // paddingHorizontal: 15,
  },
  headerinfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupinfo: {
    justifyContent: 'center',
  },
  groupname: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  groupdescription: {
    fontSize: 14,
    color: '#fff',
  },
  professionalContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 15,
    elevation: 5,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  replyContainer: {
    backgroundColor: '#f1f1f1',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  replyText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  replyButton: {
    marginTop: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberBadge: {
    color: '#ff9800',
  },
});

export default styles;
