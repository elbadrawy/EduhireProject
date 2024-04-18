import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/Home';
import LoginScreen from '../screens/login/Login';
import RejesterScreen from '../screens/rejester/Rejester';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Jobs from '../screens/jobs/Jobs';

export const MainStack = createNativeStackNavigator();
export const PreLoginStack = createNativeStackNavigator();
export const PostLoginStack = createMaterialBottomTabNavigator();

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
      activeColor="#fff"
      inactiveColor="black"
      barStyle={{ backgroundColor: '#694fad' }}
      screenOptions={{headerShown: false, headerLeft: null}}>
      <PostLoginStack.Screen
        name={'HomeScreen'}
        headerMode="none"
        initialParams={{user: props}}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'JobsScreen'}
        initialParams={{user: props}}
        component={Jobs}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="desk" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'TasksScreen'}
        headerMode="none"
        initialParams={{user: props}}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'TrainingScreen'}
        headerMode="none"
        initialParams={{user: props}}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
    </PostLoginStack.Navigator>
  );
}
