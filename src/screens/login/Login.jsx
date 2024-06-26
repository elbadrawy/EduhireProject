import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ButtonGroup,Button, Icon} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './Login.style';
import reactotron from 'reactotron-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, color } from '@rneui/base';
import { TextInput } from 'react-native-paper';
import {Input} from 'native-base';



export default function LoginScreen({navigation}) {
  // Set an initializing state whilst Firebase connects
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function login() {
    if (!email || !password) {
      Alert.alert('alert', 'Please enter the email and password');
      return null;
    }
    const emailRegex = /^[^@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please use a Gmail account.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async result => {
        await getUserDetails(result);
      })
      .catch(error => {
        let errorMessage = 'Login failed. Please try again.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please sign up first.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        }        
        Alert.alert('Login Error', errorMessage);
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
        'User is blocked please contact us to unblock the user!, eduhire@gmail.com',
        // 'eduhire@gmail.com'
      );
    } else {
      navigation.navigate('PostLoginStack', {
        user: result.user,
        userDetails: userDetails.data(),
      });
    }
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor:"#003049"}} contentContainerStyle={styles.containerStyle}>
      
      <SafeAreaView className="flex">
        <View className="flex-row justify-center">
            <Text style={styles.brandName}>EDUHIRE</Text>
            {/* <Image source={require("../images/newLogo.png")} style={{width:300, height:300}}/> */}
        </View>
      </SafeAreaView>
      <View style={styles.bottomScreen}>
        <Text style={styles.label}>Email</Text>
        <Input 
          placeholder="ahmad@gmail.com"
          value={email}
          onChangeText={v => setEmail(v)}
          style={styles.email}
           />
        
        <Text style={styles.label}>Password</Text>
        <Input 
          placeholder="Enter Password"
          value={password}
          secureTextEntry={true}
          onChangeText={v => setPassword(v)}
          style={styles.email}
        />
        
        <View>
          <Button title="Login" onPress={() => login()}
            buttonStyle={{borderRadius:25, backgroundColor:'#003049', marginBottom:20,marginTop:20,padding:13,}}
            icon={<Icon name='login' color={'white'} size={18}/>}
            iconRight
            titleStyle={{marginHorizontal:5}}
          />

        </View>
        <Text style={styles.orDivider}>OR</Text>
         
        <Button
          title="sign up"
          onPress={() => navigation.navigate('rejesterScreen')}
          buttonStyle={{borderRadius:25, backgroundColor:'#003049',padding:13,type:'outline' }}
          
        />

      </View>
      
      
      
      
      
      
      {/* <View style={{width: '100%', padding: 15}}>
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
        <View style={{marginBottom: 20}}>
          <Button title="login" onPress={() => login()} />
        </View>

        <Button
          title="sign up"
          onPress={() => navigation.navigate('rejesterScreen')}
        />
      </View> */}
    </ScrollView>
  );
}

