import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Button, ActivityIndicator } from 'react-native';
import { useUser } from '../usetext/UserContext'; // Import the UserContext
import friends from '../dummyData/Friends'; // Import the friends data
import posts from '../dummyData/Posts'; // Import the posts data

const ProfileScreen = () => {
  // Get the logged-in user from context
  const { user } = useUser();

  // If user is not loaded yet, show a loading spinner
  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  // Find the user's corresponding data from the friends list
  const currentUser = friends.find((friend) => friend.id === user.id);

  // If no matching user data, show an error message
  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text>User not found in friends data.</Text>
      </View>
    );
  }

  // Filter posts for the logged-in user
  const userPosts = posts.filter((post) => post.user.id === user.id);

  // Render each post
  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <Text style={styles.postDate}>{item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: currentUser.profilePic }} style={styles.profileImage} />
        <Text style={styles.username}>{currentUser.username}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Points: {currentUser.points}</Text>
          <Text style={styles.statsText}>
            Following: {currentUser.isFollowing ? 'Yes' : 'No'}
          </Text>
        </View>
        <Button title="Follow" onPress={() => { /* Handle follow logic */ }} />
      </View>

      {/* Posts Section */}
      <FlatList
        data={userPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  statsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default ProfileScreen;
