// notificationService.js
import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus;
};

// Example of sending push notifications
export const sendPushNotification = async (token, message) => {
  const payload = {
    notification: {
      title: 'New Message',
      body: message,
    },
  };
  await messaging().sendToDevice(token, payload);
};
