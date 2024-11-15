import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Sharing from 'expo-sharing';  // Import for sharing
import { supabase } from "../api/supabaseClient"; // Import supabase client

const Post = ({ user, content, image, userId, postId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        // Remove like from the database
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', userId)  // Current logged-in user
          .eq('post_id', postId);

        if (error) throw error;
        setLikesCount(likesCount - 1);
      } else {
        // Save like in the database
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: userId, post_id: postId });

        if (error) throw error;
        setLikesCount(likesCount + 1);
      }

      setLiked(!liked);
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      try {
        const { error } = await supabase
          .from('comments')
          .insert({ 
            users_id: userId,  // Current logged-in user
            posts_id: postId,  // Post being commented on
            content: comment 
          });

        if (error) throw error;

        setComments([...comments, comment]);
        setComment('');
        setCommentsVisible(true);  
      } catch (error) {
        console.error('Error submitting comment:', error.message);
      }
    }
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        message: `Check out this post: ${postUrl}`,  // The message to share
        url: image,  // URL of the image or post link
      };

      const result = await Sharing.shareAsync(shareOptions.url, { dialogTitle: shareOptions.message });

      if (result.action === Sharing.sharedAction) {
        // Insert share action into the database
        const { error } = await supabase
          .from('shares')
          .insert({ 
            user_id: userId,  // Current logged-in user
            post_id: postId,  // Post being shared
            platform: 'Expo'  // Optionally log the platform as Expo
          });

        if (error) throw error;
        console.log('Post shared successfully!');
      } else if (result.action === Sharing.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing post:', error.message);
    }
  };

  return (
    <View style={styles.postContainer}>
      <Text style={styles.user}>{user}</Text>
      <Text style={styles.content}>{content}</Text>
      <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLikeToggle} style={styles.actionButton}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={24}
            color={liked ? '#ff0000' : '#e63946'}  
          />
          <Text style={styles.actionText}>{likesCount} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCommentsVisible(!commentsVisible)} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#457b9d" />
          <Text style={styles.actionText}>{commentsVisible ? 'Hide Comments' : 'View Comments'}</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#f1faee" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {commentsVisible && (
        <View style={styles.commentsSection}>
          {comments.map((comment, index) => (
            <Text key={index} style={styles.comment}>
              {comment}
            </Text>
          ))}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#ccc"
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleCommentSubmit}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  user: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  content: {
    marginVertical: 8,
    fontSize: 16,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#333',
  },
  commentsSection: {
    marginTop: 10,
  },
  comment: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    flex: 1,
    marginRight: 5,
    backgroundColor: '#f9f9f9',
  },
});

export default Post;
