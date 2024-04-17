import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/Home';
import LoginScreen from '../screens/login/Login';
import RejesterScreen from '../screens/rejester/Rejester';

export const MainStack = createNativeStackNavigator();
export const PreLoginStack = createNativeStackNavigator();
export const PostLoginStack = createNativeStackNavigator();

export function preLoginStack(props) {
  return (
    <PreLoginStack.Navigator initialRouteName={'Login'}>
      <PreLoginStack.Screen name={'Login'} component={LoginScreen} />
      <PreLoginStack.Screen
        name={'rejesterScreen'}
        component={RejesterScreen}
      />
    </PreLoginStack.Navigator>
  );
}

export function postLoginStack(props) {
  return (
    <PostLoginStack.Navigator
      initialRouteName={'HomeScreen'}
      screenOptions={{headerShown: false, headerLeft: null}}>
      <PostLoginStack.Screen
        name={'HomeScreen'}
        headerMode="none"
        initialParams={{user: props}}
        component={HomeScreen}
      />
    </PostLoginStack.Navigator>
  );
}
