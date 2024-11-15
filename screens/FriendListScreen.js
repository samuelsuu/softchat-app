import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../api/supabaseClient'; // Import Supabase client

const FriendListScreen = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch profiles and follow information on mount
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("User not logged in.");
        return;
      }
      
      const { data: friendsData, error } = await supabase
        .from('profiles')
        .select('id, username');

      if (error) throw error;

      const { data: followsData } = await supabase
        .from('follows')
        .select('followed_id')
        .eq('follower_id', user.id);

      const followedIds = followsData.map((follow) => follow.followed_id);

      const friendsWithFollowStatus = friendsData.map((friend) => ({
        ...friend,
        isFollowing: followedIds.includes(friend.id),
      }));

      setFriends(friendsWithFollowStatus);
    } catch (error) {
      Alert.alert("Error fetching friends:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (friendId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('follows')
        .insert([{ follower_id: user.id, followed_id: friendId }]);

      if (error) throw error;

      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === friendId ? { ...friend, isFollowing: true } : friend
        )
      );
    } catch (error) {
      Alert.alert("Error following user:", error.message);
    }
  };

  const handleUnfollow = async (friendId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('followed_id', friendId);

      if (error) throw error;

      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === friendId ? { ...friend, isFollowing: false } : friend
        )
      );
    } catch (error) {
      Alert.alert("Error unfollowing user:", error.message);
    }
  };

  const toggleFollow = (friendId, isFollowing) => {
    if (isFollowing) {
      handleUnfollow(friendId);
    } else {
      handleFollow(friendId);
    }
  };

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendContainer}>
      <Text style={styles.friendName}>{item.username}</Text>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing ? styles.unfollowButton : styles.follow]}
        onPress={() => toggleFollow(item.id, item.isFollowing)}
      >
        <Text style={styles.buttonText}>{item.isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend List</Text>
      {loading ? <Text>Loading...</Text> : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendName: {
    fontSize: 18,
    color: '#333',
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  follow: {
    backgroundColor: '#457b9d',
  },
  unfollowButton: {
    backgroundColor: '#e63946',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FriendListScreen;
