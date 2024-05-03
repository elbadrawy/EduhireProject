import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import Container from '../Container';

const WelcomeMessage = ({ username }) => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
};

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

const NewPostInput = () => {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = (text) => {
    setNewPost(text);
  };

  const handlePostSubmit = () => {
    // Handle submitting the new post
    console.log('New post submitted:', newPost);
    setNewPost('');
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={newPost}
        onChangeText={handlePostChange}
        multiline
      />
      <TouchableOpacity onPress={handlePostSubmit} style={styles.postButton}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const PostsPage = () => {
  const username = 'Mohamed elbadrawy';

  // Dummy data for posts
  const posts = [
    { id: '1', username: 'John Doe', content: 'This is my first post!', date: '2024-05-03' },
    { id: '2', username: 'Jane Smith', content: 'Hello, world!', date: '2024-05-02' },
  ];

  return (
    <Container containerStyle={styles.container}>
      <WelcomeMessage username={username} />
      <NewPostInput />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            username={item.username}
            content={item.content}
            date={item.date}
          />
        )}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#5890FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostsPage;
