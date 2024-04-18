import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack, preLoginStack, postLoginStack} from './src/stacks/Stacks';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }
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
          <MainStack.Screen name="PreLoginStack" component={preLoginStack} />
          <MainStack.Screen
            name="PostLoginStack"
            component={() => postLoginStack(user)}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
