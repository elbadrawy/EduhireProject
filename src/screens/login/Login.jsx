import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ButtonGroup, Input, Button} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './Login.style';
import reactotron from 'reactotron-react-native';

export default function LoginScreen({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function login() {
    if (!email || !password) {
      Alert.alert('alert', 'Please enter the email and password');
      return null;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async result => {
        await getUserDetails(result);
      })
      .catch(e => {
        Alert.alert('alert', e.toString());
      });
  }

  const signOut = () => {
    auth().signOut();
  };

  const getUserDetails = async result => {
    const userDetails = await firestore()
      .collection('Users')
      .doc(result?.user?.uid)
      .get();
    if (userDetails.data().blocked === '1') {
      signOut();
      Alert.alert(
        'error',
        'User is blocked please contact us to unblock the user',
      );
    } else {
      navigation.navigate('PostLoginStack', {
        user: result.user,
        userDetails: userDetails.data(),
      });
    }
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={{width: '100%', padding: 15}}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={v => setEmail(v)}
        />
        <Input
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={v => setPassword(v)}
        />
        <Button title="login" onPress={() => login()} />
        <Button
          style={{marginTop: 20}}
          title="sign up"
          onPress={() => navigation.navigate('rejesterScreen')}
        />
      </View>
    </ScrollView>
  );
}
