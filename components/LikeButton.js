import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity 
      onPress={() => setLiked(!liked)} 
      style={styles.button}
    >
      <Text style={[styles.likeText, liked ? styles.liked : styles.unliked]}>
        {liked ? '♥' : '♡'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  likeText: {
    fontSize: 24,
    fontWeight: 'bold', // Optional: Adds more visibility to the heart symbol
  },
  liked: {
    color: '#ff0000', // Solid red when liked
  },
  unliked: {
    color: '#000000', // Solid black when unliked
  },
});

export default LikeButton;
