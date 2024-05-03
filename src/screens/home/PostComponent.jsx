import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const Post = ({ username, content, date }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
        <IconButton icon={liked ? 'thumb-up' : 'thumb-up-outline'} color={liked ? '#5890FF' : '#000'} size={20} />
        <Text style={styles.likeCount}>{likeCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: '#777',
  },
  content: {
    marginBottom: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
});

export default Post;
