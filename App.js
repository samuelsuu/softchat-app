import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './usetext/UserContext'; // Import UserProvider
import ProfileScreen from './screens/ProfileScreen';

export default function App() {
  return (
    <UserProvider> 
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}
