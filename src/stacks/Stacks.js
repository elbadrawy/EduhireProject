/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/Home';
import LoginScreen from '../screens/login/Login';
import RejesterScreen from '../screens/rejester/Rejester';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Jobs from '../screens/jobs/Jobs';
import Tasks from '../screens/tasks/Tasks';
import Training from '../screens/training/Training';
import SubmitJob from '../screens/jobs/SubmitJob';
import SubmitTask from '../screens/tasks/SubmitTask';
import SubmitTraining from '../screens/training/SubmitTraining';

export const MainStack = createNativeStackNavigator();
export const PreLoginStack = createNativeStackNavigator();
export const PostLoginStack = createMaterialBottomTabNavigator();
export const JobStack = createNativeStackNavigator();

export function PreLoginComponent() {
  return (
    <PreLoginStack.Navigator initialRouteName={'Login'}>
      <PreLoginStack.Screen name={'Login'} component={LoginScreen} />
      <PreLoginStack.Screen
        name={'rejesterScreen'}
        component={RejesterScreen}
        options={{headerTitle: 'Registration'}}
      />
    </PreLoginStack.Navigator>
  );
}

export function PostLoginComponent({route}) {
  const {params} = route;
  return (
    <PostLoginStack.Navigator
      initialRouteName={'HomeScreen'}
      activeColor="#fff"
      inactiveColor="black"
      barStyle={{backgroundColor: '#694fad'}}
      screenOptions={{headerShown: false, headerLeft: null}}>
      <PostLoginStack.Screen
        name={'HomeScreen'}
        headerMode="none"
        initialParams={params}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'JobsStack'}
        initialParams={params}
        component={JobStackComponent}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="desk" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'TasksScreen'}
        headerMode="none"
        initialParams={params}
        component={TaskStackComponent}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'TrainingScreen'}
        headerMode="none"
        initialParams={params}
        component={TrainingStackComponent}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={'black'} size={26} />
          ),
        }}
      />
    </PostLoginStack.Navigator>
  );
}

export function JobStackComponent({route}) {
  const {params} = route;
  return (
    <JobStack.Navigator initialRouteName={'JobsScreen'}>
      <JobStack.Screen
        name={'JobsScreen'}
        initialParams={params}
        component={Jobs}
        options={{
          headerShown: false,
          headerTitle: 'My Jobs',
        }}
      />
      <JobStack.Screen
        name={'applyNewJob'}
        initialParams={params}
        component={SubmitJob}
        options={{headerTitle: 'Submit Job'}}
      />
      <JobStack.Screen
        name={'appliedJobs'}
        initialParams={params}
        component={SubmitJob}
        options={{headerTitle: 'Applied Jobs'}}
      />
      <JobStack.Screen
        name={'canadents'}
        initialParams={params}
        component={SubmitJob}
        options={{headerTitle: 'Canadents'}}
      />
    </JobStack.Navigator>
  );
}

export function TaskStackComponent({route}) {
  const {params} = route;
  return (
    <JobStack.Navigator initialRouteName={'TasksScreen'}>
      <JobStack.Screen
        name={'TasksScreen'}
        initialParams={params}
        component={Tasks}
        options={{
          headerShown: false,
          headerTitle: 'My Tasks',
        }}
      />
      <JobStack.Screen
        name={'applyNewTask'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Submit Task'}}
      />
      <JobStack.Screen
        name={'solvedTasks'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Solved Task'}}
      />
    </JobStack.Navigator>
  );
}

export function TrainingStackComponent({route}) {
  const {params} = route;
  return (
    <JobStack.Navigator initialRouteName={'TrainingScreen'}>
      <JobStack.Screen
        name={'TrainingScreen'}
        initialParams={params}
        component={Training}
        options={{
          headerShown: false,
        }}
      />
      <JobStack.Screen
        name={'applyNewTraining'}
        initialParams={params}
        component={SubmitTraining}
        options={{headerTitle: 'Submit Training'}}
      />
      <JobStack.Screen
        name={'appliedTraining'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Applied Training'}}
      />
      <JobStack.Screen
        name={'trainingCanadents'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Training Canadents'}}
      />
    </JobStack.Navigator>
  );
}
