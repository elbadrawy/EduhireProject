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
  // Button,
} from 'react-native';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import Container from '../Container';
import firestore from '@react-native-firebase/firestore';
import reactotron from 'reactotron-react-native';
import { Button, Icon } from '@rneui/base';
//aa

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
    const milliseconds = seconds * 1000 + nanoseconds / 1000000; // start Converting to readable format
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Retrieves the month from the Date object (0-indexed, where January is 0 and December is 11),
    const day = date.getDate().toString().padStart(2, '0'); // Retrieves the day of the month from the Date object, converts it to a string, and pads it with a leading zero if it is less than 10 (to ensure the day always has two digits).
    return `${year}-${month}-${day}`;
  };

  return ( // Post Body
    <View style={[styles.postBody]}>
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

  return ( // Write Post
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
  const [loading, setLoading] = useState(true); // for loading spinner
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
        let querySnapshot = await firestore()
            .collection('Posts')
            .orderBy('postDate', 'desc') // This will order the posts by date in descending order
            .get();
        const PostsPromises = querySnapshot.docs.map(async documentSnapshot => { // documentSnapshot represents a document from Firestore
            let UserData = await getUserInfo(documentSnapshot.data().userID);
            return {
                ...documentSnapshot.data(), //... This uses the spread operator to copy all the fields from the original document data into a new object.
                key: documentSnapshot.id, //  Adds a new field key, which is set to the ID of the document
                user: {...UserData},  // Adds a new field user, which is an object containing all the data of the user associated with this document.
            };
        });
        const postsData = await Promise.all(PostsPromises); // take all info about the documet
        setPosts(postsData); // assign it to setPosts
        setLoading(false); // Loading sppener disapear
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
        <Button type='solid' onPress={signOut}
          buttonStyle={{borderRadius:70, padding:2, backgroundColor:'transparent', }}
          icon={<Icon name='logout'  color={'#fff'}/>}
          
        />
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
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center', height:'100%'}}>
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
    borderWidth:1,
    borderColor:"rgba(0, 0, 0, 0.09)",
    
  },
  postBody:{
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'space-between',
    paddingHorizontal: 15,
    paddingTop: 5,
    borderWidth:1,
    borderColor:"rgba(0, 0, 0, 0.2)",
    margin:5,
    borderRadius:10,
    shadowColor:"#333333",
    minHeight:150,
    maxHeight:250,
    
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:17,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding:10,
    backgroundColor:'#003049',
    // borderWidth:2,
    borderBottomWidth:1,
    borderBottomColor:"rgba(0,0,0,0.2)",
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    shadowColor:"#333333",
    shadowOfset:{
    width:10,
    height:10,
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    
  },
  welcomeContainer: {
    paddingHorizontal: 15,
    
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth:1,
    borderBottomColor:"rgba(0,0, 0, 0.4)"
  },
  username: {
    fontWeight: 'bold',
    color:'#003049',
  },
  date: {
    color: '#777777a5',
  },
  content: {
    marginBottom: 10,
    fontSize:14,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    
    // borderTopWidth:1,
    // borderTopColor:'rgba(0,0,0,0.2)',
    
  },
  likeCount: {
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    // borderWidth:2,
    minHeight:150,
    maxHeight:200,
    gap:5,
    borderBottomWidth:1,
    borderBottomColor:"rgba(0, 0, 0,0.3)",
    paddingBottom:10,
    
  },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor:'white',
    borderRadius: 10,
    padding: 10,
    // marginRight: 10,
    width:'100%',
    shadowColor:"#333333",
    shadowOfset:{
    width:10,
    height:10,
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:17,
  },
  postButton: {
    backgroundColor: '#003049',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width:200,
    shadowColor:"#333333",
    shadowOfset:{
    width:10,
    height:10,
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:17,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
