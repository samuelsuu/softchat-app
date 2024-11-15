import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../api/supabaseClient'; // Import your Supabase client

const PostScreen = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick an image from the user's gallery
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload image to Supabase storage bucket
  const uploadImageToSupabase = async (uri) => {
    try {
      // Fetch the logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('You must be logged in to make a post.');
        return null;
      }
  
      // Prepare the file path and name for the image
      const imageName = `${user.id}-${Date.now()}.jpg`;  // Unique name for the image
      const filePath = `${imageName}`;  // Just the image name for root-level storage
  
      // Fetch the image from the URI
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }
  
      // Convert the fetched image to a blob
      const blob = await response.blob();
  
      // Upload the image blob to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')  // Make sure your bucket is correctly named 'posts'
        .upload(filePath, blob, {
          contentType: blob.type,  // Dynamic content type
        });
  
      if (uploadError) {
        console.error('Error uploading image to Supabase:', uploadError);
        throw new Error(uploadError.message);
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL of the uploaded image
      const { publicURL, error: urlError } = supabase.storage
        .from('posts')  // Ensure you're getting the URL from the 'posts' bucket
        .getPublicUrl(filePath);
  
      if (urlError) {
        console.error('Error getting public URL:', urlError);
        return null;
      }

      console.log('Public URL of the image:', publicURL);
  
      return publicURL;  // Return the public URL of the uploaded image
    } catch (error) {
      Alert.alert('Error uploading image:', error.message);
      return null;
    }
  };
  
  // Function to submit the post with the image and content
  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Please enter some content before posting.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Fetch the logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        Alert.alert('You must be logged in to make a post.');
        setLoading(false);
        return;
      }
  
      // Upload the image if it exists
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToSupabase(image);  // Upload the image and get its URL
        if (!imageUrl) {
          throw new Error('Image upload failed');
        }
      }
  
      // Save the post in the 'posts' table, including the image_url if available
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { user_id: user.id, content, image_url: imageUrl }  // Include image_url
        ]);
  
      if (error) {
        throw new Error(error.message);
      }
  
      Alert.alert('Post submitted successfully!');
      setContent('');
      setImage(null);  // Reset the form after successful submission
    } catch (error) {
      Alert.alert('Error submitting post:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a Post</Text>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
      />
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleImagePick} style={styles.button}>
          <Ionicons name="image-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 30, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#457b9d',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default PostScreen;
