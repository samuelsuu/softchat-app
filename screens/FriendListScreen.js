import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import friends from '../dummyData/Friends'; // Import friends data

const FriendListScreen = () => {
  const [friendsList, setFriendsList] = useState(friends); // Use the dummy friends data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFollow = (friendId) => {
    setFriendsList((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isFollowing: true } : friend
      )
    );
  };

  const handleUnfollow = (friendId) => {
    setFriendsList((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === friendId ? { ...friend, isFollowing: false } : friend
      )
    );
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
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.followButton, item.isFollowing ? styles.unfollowButton : styles.follow]}
            onPress={() => toggleFollow(item.id, item.isFollowing)}
          >
            <Text style={styles.buttonText}>{item.isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend List</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#457b9d" />
      ) : (
        <FlatList
          data={friendsList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContainer}
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
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#457b9d',
    marginRight: 20,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#457b9d',
  },
  follow: {
    backgroundColor: '#457b9d',
  },
  unfollowButton: {
    backgroundColor: '#e63946',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#1d3557',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FriendListScreen;
