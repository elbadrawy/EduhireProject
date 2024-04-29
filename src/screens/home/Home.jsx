import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import styles from './Home.style';
import reactotron from 'reactotron-react-native';

export default function HomeScreen({route, navigation}) {
  const {user} = route.params;

  const getUserDetails = async () => {
    const userDetails = await firestore()
      .collection('Users')
      .doc(user.uid)
      .get();
    console.log(userDetails);
  };

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

  return (
    <View style={styles.containerStyle}>
      <Text onPress={() => null}>Welcome {user.email}</Text>
      <Text onPress={() => getUserDetails()}>details</Text>
      <Text onPress={() => signOut()}>SignOut</Text>
    </View>
  );
}
