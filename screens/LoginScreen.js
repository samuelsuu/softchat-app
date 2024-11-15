import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../api/supabaseClient'; // Import supabase client

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login error:', error.message);
    } else {
      Alert.alert('Login successful!');
      navigation.navigate('Main'); // Navigate to the main screen after login
    }
  };

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.container}>
      <Text style={styles.title}>Welcome to SoftChat</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      
      {/* Forgot Password link */}
      <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot Password?
      </Text>

      <Text style={styles.switchText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  title: { fontSize: 32, color: '#fff', marginBottom: 20 },
  input: { width: 250, height: 40, backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  forgotPassword: { color: '#fff', marginTop: 10, textDecorationLine: 'underline' },
  switchText: { color: '#fff', marginTop: 20, textDecorationLine: 'underline' },
});

export default LoginScreen;
