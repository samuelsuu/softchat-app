import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Post from "../components/Post";
import posts from "../dummyData/Posts"; // Import the posts data

const HomeScreen = ({ navigation }) => {
  const [notifications] = useState(3); // Example notification count
  const [newPostContent, setNewPostContent] = useState(""); // State for new post content
  const [loading, setLoading] = useState(false); // Loading state
  const [postList, setPostList] = useState([]); // State for posts

  // Load the posts when the component mounts
  useEffect(() => {
    setLoading(true);
    setPostList(posts);
    setLoading(false);
  }, []);

  // Handle new post submission with dummy logic
  const handleNewPostSubmit = () => {
    if (!newPostContent.trim()) {
      Alert.alert("Please enter some content before posting.");
      return;
    }

    // Add new post to the list of posts
    const newPost = {
      id: (postList.length + 1).toString(),
      content: newPostContent,
      created_at: new Date().toISOString(),
      user: posts[postList.length % posts.length].user, // Assign a user from existing posts
    };
    setPostList([newPost, ...postList]);
    setNewPostContent(""); // Clear the input field
    Alert.alert("Post submitted successfully!");
  };

  // Extract username and points from the first post's user (for example purposes)
  const { username, points } = posts[0]?.user || { username: "Guest User", points: 0 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          <Text style={styles.pointsText}>Points: {points}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          {notifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>{notifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* New Post Input */}
      <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <TouchableOpacity onPress={handleNewPostSubmit}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Post List */}
      <FlatList
        data={postList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            user={item.user.username}
            content={item.content}
            image={item.image} // Pass the image URL to the Post component
          />
        )}
        refreshing={loading}
        onRefresh={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginTop: 30,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#457b9d",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  welcomeTextContainer: { flexDirection: "column" },
  welcomeText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  pointsText: { fontSize: 16, color: "#fff", marginVertical: 5 },
  notificationIcon: { position: "relative", paddingRight: 10 },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  notificationCount: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  newPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  newPostInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  postButton: { color: "#457b9d", fontWeight: "bold" },
});

export default HomeScreen;
