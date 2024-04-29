import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {
  MainStack,
  PreLoginComponent,
  PostLoginComponent,
} from './src/stacks/Stacks';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import reactotron from 'reactotron-react-native';

if (__DEV__) {
  require('./ReactotronConfig');
}
export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const getUserDetails = async userID => {
    const userDetails = await firestore().collection('Users').doc(userID).get();
    setUserDetails(userDetails.data());
  };
  // Handle user state changes
  const onAuthStateChanged = async user => {
    setUser(user);
    await getUserDetails(user?.uid);
    if (initializing) {
      setInitializing(false);
    }
  };
  if (initializing) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainStack.Navigator
          headerMode="none"
          screenOptions={{headerShown: false, headerLeft: null}}
          initialRouteName={user ? 'PostLoginStack' : 'PreLoginStack'}>
          <MainStack.Screen
            name="PreLoginStack"
            component={PreLoginComponent}
          />
          <MainStack.Screen
            name="PostLoginStack"
            initialParams={{user, userDetails}}
            component={PostLoginComponent}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
