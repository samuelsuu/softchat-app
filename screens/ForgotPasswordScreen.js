import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../api/supabaseClient'; // Import supabase client

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password recovery email sent. Please check your inbox.');
      navigation.navigate('Login'); // Navigate to Login screen after request
    }
  };

  return (
    <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Recovery Email" onPress={handlePasswordRecovery} />
      <Text style={styles.switchText} onPress={() => navigation.navigate('Login')}>
        Remembered your password? Login here
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  title: { fontSize: 32, color: '#fff', marginBottom: 20 },
  input: { width: 250, height: 40, backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  switchText: { color: '#fff', marginTop: 20, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;
