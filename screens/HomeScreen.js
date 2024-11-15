import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Button,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Using icon library
import Post from "../components/Post";
import { supabase } from "../api/supabaseClient"; // Import supabase client

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState(""); // State for username
  const [points, setPoints] = useState(100); // Replace with actual points from your backend or state
  const [notifications] = useState(3); // Example notification count
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [newPostContent, setNewPostContent] = useState(""); // State for new post content
  const [posts, setPosts] = useState([]); // State for posts
  const [loading, setLoading] = useState(false); // Loading state

  
  // Fetch the logged-in user's username
  useEffect(() => {
    const fetchUsername = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        Alert.alert("Error fetching session:", sessionError.message);
        return;
      }

      const user = sessionData?.session?.user;

      // Log the session data to ensure user is being retrieved
      console.log("Session Data: ", sessionData);

      if (user) {
        const { data, error } = await supabase
          .from("profiles") // Ensure this matches your table name
          .select("username")
          .eq("id", user.id) // Ensure user.id matches the profile's id
          .single();

        if (error) {
          Alert.alert("Error fetching username:", error.message);
        } else {
          console.log("Fetched Username Data: ", data); // Log the data to check the structure
          setUsername(data?.username || "user"); // Set username only if data is available
        }
      }
    };

    fetchUsername();
  }, []);

  // Fetch all posts from the Supabase database
  const fetchPosts = async () => {
    setLoading(true);

    // Join the posts table with profiles to get the username
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        content,
        created_at,
        profiles (
          username
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error fetching posts:", error.message);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle new post submission
  const handleNewPostSubmit = async () => {
    if (!newPostContent.trim()) {
      Alert.alert("Please enter some content before posting.");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      Alert.alert("You must be logged in to post.");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([{ user_id: user.id, content: newPostContent, username }]);

    if (error) {
      Alert.alert("Error submitting post:", error.message);
    } else {
      Alert.alert("Post submitted successfully!");
      setNewPostContent(""); // Clear the input field
      fetchPosts(); // Re-fetch posts to include the new one
    }
  };

  // Handle deposit
  const handleDeposit = () => {
    const pointsToDeposit = parseInt(amount);
    if (isNaN(pointsToDeposit) || pointsToDeposit <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount to deposit.");
      return;
    }
    setPoints((prevPoints) => prevPoints + pointsToDeposit);
    Alert.alert(
      `You have deposited ${pointsToDeposit} points! Your new balance is ${
        points + pointsToDeposit
      }.`
    );
    setModalVisible(false);
    setAmount("");
  };

  // Handle withdraw
  const handleWithdraw = () => {
    const pointsToWithdraw = parseInt(amount);
    if (
      isNaN(pointsToWithdraw) ||
      pointsToWithdraw <= 0 ||
      pointsToWithdraw > points
    ) {
      Alert.alert("Invalid amount", "Please enter a valid amount to withdraw.");
      return;
    }
    setPoints((prevPoints) => prevPoints - pointsToWithdraw);
    Alert.alert(
      `You have withdrawn ${pointsToWithdraw} points! Your new balance is ${
        points - pointsToWithdraw
      }.`
    );
    setModalVisible(false);
    setAmount("");
  };

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

      {/* Points Actions */}
      <View style={styles.buttonContainer}>
        <Button title="Deposit Points" onPress={handleDeposit} />
        <Button title="Withdraw Points" onPress={handleWithdraw} />
      </View>

      {/* New Post Section */}
      {/* <View style={styles.newPostContainer}>
        <TextInput
          style={styles.newPostInput}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <Button title="Post" onPress={handleNewPostSubmit} />
      </View> */}

      {/* Post List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            user={item.profiles?.username}
            content={item.content}
            image={item.image_url} // Make sure image_url is valid
          />
        )}
        refreshing={loading}
        onRefresh={fetchPosts} // Pull to refresh
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
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
});

export default HomeScreen;
