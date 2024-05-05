/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Container from '../Container';
import firestore from '@react-native-firebase/firestore';
import reactotron from 'reactotron-react-native';

const WelcomeMessage = ({username}) => {
  return (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
    </View>
  );
};

const Post = ({
  username,
  content,
  date,
  initialLikeCount,
  isLiked,
  updateLikeCount,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }

    // Call the function to update the like count and liked status
    updateLikeCount(!liked);
  };

  const formatPostDate = ({seconds, nanoseconds}) => {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.date}>{formatPostDate(date)}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
        <IconButton
          icon={liked ? 'thumb-up' : 'thumb-up-outline'}
          color={liked ? '#5890FF' : '#000'}
          size={20}
        />
        <Text style={styles.likeCount}>{likeCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const NewPostInput = ({submitPost}) => {
  const [newPost, setNewPost] = useState('');

  const handlePostChange = text => {
    setNewPost(text);
  };

  const handlePostSubmit = () => {
    submitPost(newPost);
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

export default function HomeScreen({route}) {
  const navigation = useNavigation();
  const {user} = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const signOut = () => {
    auth()
      .signOut()
      .then(() =>
        navigation.navigate('PreLoginStack', {
          screen: 'Login',
        }),
      );
  };

  if (!user) {
    return null;
  }

  const getUserInfo = async userID => {
    const document = await userID.get();
    return document.data();
  };
  const fetchPosts = async (refresh = false) => {
    try {
      refresh ? setRefreshLoading(true) : setLoading(true);
      let querySnapshot = await firestore().collection('Posts').get();
      const PostsPromises = querySnapshot.docs.map(async documentSnapshot => {
        let UserData = await getUserInfo(documentSnapshot.data().userID);
        return {
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
          user: {...UserData},
        };
      });
      const postsData = await Promise.all(PostsPromises);
      setPosts(postsData);
      setLoading(false);
      refresh && setRefreshLoading(false);
    } catch (error) {
      refresh && setRefreshLoading(false);
      setLoading(false);
      console.error('Error fetching Posts:', error);
    }
  };

  const username = user.email;

  const submitPost = async content => {
    if (content.length > 0) {
      const userRef = await firestore().collection('Users').doc(user?.uid);
      firestore()
        .collection('Posts')
        .doc()
        .set({
          content,
          likedUsers: [],
          postDate: firestore.FieldValue.serverTimestamp(),
          userID: userRef,
        })
        .then(() => fetchPosts());
    }
  };

  return (
    <Container containerStyle={styles.container}>
      <View style={styles.header}>
        <WelcomeMessage username={username} />
        <Button title="Sign Out" onPress={signOut} />
      </View>
      <NewPostInput submitPost={submitPost} />
      <FlatList
        data={posts}
        onRefresh={() => fetchPosts(true)}
        refreshing={refreshLoading}
        ItemSeparatorComponent={() => <View style={{marginTop: 10}} />}
        ListEmptyComponent={() =>
          loading ? (
            <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />
          ) : (
            <View
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Text>No Posts Available Yet</Text>
            </View>
          )
        }
        keyExtractor={item => item.key}
        renderItem={({item}) => {
          let username;
          if (item.user.type === '1') {
            username = `${item.user.firstname} ${item.user.lastname}`;
          } else if (item.user.type === '2') {
            username = item.user.companyInfo?.contactName;
          } else if (item.user.type === '3') {
            username = item.user.mentorDetails.name;
          } else {
            username = 'Unknown';
          }
          return (
            <Post
              username={username}
              content={item.content}
              date={item.postDate}
              initialLikeCount={item?.likedUsers?.length} // Use the length of likedUsers array as initial like count
              isLiked={item?.likedUsers?.some(
                likedUser => likedUser.id === user.uid,
              )} // Check if current user has liked the post
              updateLikeCount={isLiked => {
                const postRef = firestore().collection('Posts').doc(item.key);
                const userRef = firestore().collection('Users').doc(user?.uid);
                let updatedLikedUsers;
                if (isLiked) {
                  updatedLikedUsers = [...item.likedUsers, userRef]; // Add current user to likedUsers array
                } else {
                  updatedLikedUsers = item.likedUsers.filter(
                    likedUser => likedUser.id !== user.uid,
                  ); // Remove current user from likedUsers array
                }
                postRef.update({likedUsers: updatedLikedUsers});
              }}
            />
          );
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeContainer: {
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
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
