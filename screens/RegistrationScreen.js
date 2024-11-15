import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../api/supabaseClient'; // Import supabase client

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); // New state for username

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      // Check if email is already registered in auth.users
      const { data: existingUser} = await supabase
        .from('auth.users') // Assuming 'auth.users' table exists in Supabase for registered users
        .select('id')
        .eq('email', email)
        .single();

      // If email already exists, notify the user and stop registration
      if (existingUser) {
        Alert.alert('Email already registered. Please use another email.');
        return;
      }

      // Proceed with registration if no existing email is found
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // Check for error in signUp response
      if (error) {
        Alert.alert('Registration error:', error.message);
        return;
      }

      // Save the new user profile in the 'users' table
      const { error: userError } = await supabase
        .from('users') // Assuming you have a 'profiles' table
        .insert([{ id: data.user.id, username, email }]);

      if (userError) {
        Alert.alert('Error saving username:', userError.message);
      } else {
        Alert.alert('Registration successful! Please check your email for verification.');
        navigation.navigate('Login'); // Navigate to login after successful registration
      }
    } catch (error) {
      Alert.alert('Unexpected error:', error.message);
    }
  };

  return (
    <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.container}>
      <Text style={styles.title}>Register for SoftChat</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Register" onPress={handleRegister} />
      <Text
        style={styles.switchText}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login here
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

export default RegistrationScreen;
