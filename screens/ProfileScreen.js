import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import img4 from "../assets/images/user.jpg";
import { supabase } from '../api/supabaseClient';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [profileImage, setProfileImage] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [newPhone, setNewPhone] = useState(phone);
  const [modalVisible, setModalVisible] = useState(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostImage, setSelectedPostImage] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Error fetching user:", error.message);
        return;
      }

      if (user) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          Alert.alert("Error fetching profile:", profileError.message);
          return;
        }

        setBio(data.bio || "");
        setPhone(data.phone || "");
        setProfileImage(data.profile_image || img4);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        Alert.alert("Error fetching session:", sessionError.message);
        return;
      }

      const user = sessionData?.session?.user;

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) {
          Alert.alert("Error fetching username:", error.message);
        } else {
          setUsername(data?.username || "");
        }
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchCountsAndPosts = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (user) {
          const { count: postsCount, error: postsError } = await supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

          if (postsError) {
            throw postsError;
          }
          setUserPostsCount(postsCount);

          const { count: followers, error: followersError } = await supabase
            .from('follows')
            .select('*', { count: 'exact' })
            .eq('followed_id', user.id);

          if (followersError) {
            throw followersError;
          }
          setFollowersCount(followers);

          const { count: following, error: followingError } = await supabase
            .from('follows')
            .select('*', { count: 'exact' })
            .eq('follower_id', user.id);

          if (followingError) {
            throw followingError;
          }
          setFollowingCount(following);

          const { data: posts, error: postsFetchError } = await supabase
            .from('posts')
            .select('*, likes(count)')
            .eq('user_id', user.id);

          if (postsFetchError) {
            throw postsFetchError;
          }

          const postsWithLikes = await Promise.all(posts.map(async (post) => {
            const { count: likesCount } = await supabase
              .from('likes')
              .select('*', { count: 'exact' })
              .eq('post_id', post.id);
            return { ...post, likes: likesCount || 0 };
          }));

          setUserPosts(postsWithLikes);
        }
      } catch (error) {
        Alert.alert("Error fetching data:", error.message);
      }
    };

    fetchCountsAndPosts();
  }, []);

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setNewContent(post.content);
    setSelectedPostImage(post.image); // Set the image for editing
    setEditPostModalVisible(true); // Open edit post modal
  };

  const handleUpdatePost = async () => {
    if (!newContent.trim()) {
        Alert.alert('Please enter content before updating.');
        return;
    }

    try {
        const updatedPost = { content: newContent };
        if (selectedPostImage) {
            const response = await fetch(selectedPostImage);
            const blob = await response.blob();
            const { data } = await supabase.storage
                .from("post-images")
                .upload(`public/${selectedPost.id}/post_image.jpg`, blob, {
                    contentType: "image/jpeg",
                });

            const { publicURL } = supabase.storage.from("post-images").getPublicUrl(data.path);
            updatedPost.image = publicURL; // Include the new image URL
        }

        const { error } = await supabase
            .from('posts')
            .update(updatedPost)
            .eq('id', selectedPost.id);

        if (error) {
            throw new Error(error.message);
        }

        Alert.alert('Post updated successfully!');
        setEditPostModalVisible(false);
        fetchCountsAndPosts(); // Fetch updated posts
    } catch (error) {
        Alert.alert('Error updating post:', error.message);
    }
};

// Rendering the selected post image
{selectedPostImage ? (
    <Image source={{ uri: selectedPostImage }} style={styles.postImage} />
) : null}


  const handleDeletePost = async (postId) => {
    try {
      const confirmation = await new Promise((resolve) => {
        Alert.alert(
          'Delete Post',
          'Are you sure you want to delete this post?',
          [
            { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
            { text: 'OK', onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirmation) return;

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert('Post deleted successfully!');
      setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      Alert.alert('Error deleting post:', error.message);
    }
  };

  const handleSave = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      Alert.alert("Error fetching user:", userError.message);
      return;
    }

    if (!user) {
      Alert.alert("User not authenticated.");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        bio: bio,
        profile_image: profileImage,
        phone_number: newPhone
      });

    if (error) {
      Alert.alert("Error saving profile:", error.message);
    } else {
      setPhone(newPhone);
      setModalVisible(false);
    }
  };

  const handleImagePickForPost = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setSelectedPostImage(selectedImage); // Update the image for the selected post
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setProfileImage(selectedImage);

      // Upload the new image to Supabase storage
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(`public/${Date.now()}.jpg`, blob, {
          contentType: "image/jpeg",
        });

      if (error) {
        Alert.alert("Error uploading image:", error.message);
      } else {
        const { publicURL } = supabase.storage.from("profile-images").getPublicUrl(data.path);
        setProfileImage(publicURL);
      }
    }
  };

// Handle Logout
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert("Logout error:", error.message);
  } else {
    Alert.alert("You have been logged out successfully!");
    navigation.navigate("Login"); // Navigate to login screen
  }
};
  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postText}>{item.content}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.postImage} />}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={() => handleEditPost(item)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <Text style={styles.phone}>{phone}</Text>
        <View style={styles.countsContainer}>
          <Text>Posts: {userPostsCount}</Text>
          <Text>Followers: {followersCount}</Text>
          <Text>Following: {followingCount}</Text>
        </View>
        <Button title="Edit Profile" onPress={() => setModalVisible(true)} />
      </View>

      <FlatList
        data={userPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
      />

       {/* Logout Button */}
       <Button title="Logout" onPress={handleLogout} />

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Profile</Text>
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={newPhone}
            onChangeText={setNewPhone}
          />
          <Button title="Pick Profile Image" onPress={handleImagePick} />
          <Button title="Save Changes" onPress={handleSave} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editPostModalVisible}
        onRequestClose={() => setEditPostModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Edit content"
            value={newContent}
            onChangeText={setNewContent}
          />
          {selectedPostImage && <Image source={{ uri: selectedPostImage }} style={styles.postImage} />}
          <Button title="Pick New Image" onPress={handleImagePickForPost} />
          <Button title="Update Post" onPress={handleUpdatePost} />
          <Button title="Close" onPress={() => setEditPostModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
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
    fontWeight: "bold",
  },
  bio: {
    fontSize: 16,
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    marginBottom: 5,
  },
  countsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 5,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editText: {
    color: "blue",
  },
  deleteText: {
    color: "red",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: "100%",
  },
});

export default ProfileScreen;
