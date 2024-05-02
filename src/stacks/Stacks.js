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
import JobCanadents from '../screens/jobs/JobCanadents';
import TrainingCanandents from '../screens/training/TrainingCanadents';
import JobApply from '../screens/jobs/JobApply';
import TrainingApply from '../screens/training/TrainingApply';
import TaskApply from '../screens/tasks/TaskApply';
import JobHistory from '../screens/jobs/JobsHistory';
import TrainingHistory from '../screens/training/TrainingHistory';
import TaskHistory from '../screens/tasks/TaskHistory';


export const MainStack = createNativeStackNavigator();
export const PreLoginStack = createNativeStackNavigator();
export const PostLoginStack = createMaterialBottomTabNavigator();
export const JobStack = createNativeStackNavigator();
export const TasksStack = createNativeStackNavigator();
export const TrainingStack = createNativeStackNavigator();


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
        name={'jobCanadents'}
        initialParams={params}
        component={JobCanadents}
        options={{headerTitle: 'Canadents'}}
      />
      <JobStack.Screen
        name={'jobApply'}
        initialParams={params}
        component={JobApply}
        options={{headerTitle: 'Apply For Job'}}
      />
      <JobStack.Screen
        name={'jobHistory'}
        initialParams={params}
        component={JobHistory}
        options={{headerTitle: 'Job History'}}
      />
    </JobStack.Navigator>
  );
}

export function TaskStackComponent({route}) {
  const {params} = route;
  return (
    <TasksStack.Navigator initialRouteName={'TasksScreen'}>
      <TasksStack.Screen
        name={'TasksScreen'}
        initialParams={params}
        component={Tasks}
        options={{
          headerShown: false,
          headerTitle: 'My Tasks',
        }}
      />
      <TasksStack.Screen
        name={'applyNewTask'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Submit Task'}}
      />
      <TasksStack.Screen
        name={'taskApply'}
        initialParams={params}
        component={TaskApply}
        options={{headerTitle: 'Apply for Task'}}
      />
      <TasksStack.Screen
        name={'taskHistory'}
        initialParams={params}
        component={TaskHistory}
        options={{headerTitle: 'Task History'}}
      />
    </TasksStack.Navigator>
  );
}

export function TrainingStackComponent({route}) {
  const {params} = route;
  return (
    <TrainingStack.Navigator initialRouteName={'TrainingScreen'}>
      <TrainingStack.Screen
        name={'TrainingScreen'}
        initialParams={params}
        component={Training}
        options={{
          headerShown: false,
        }}
      />
      <TrainingStack.Screen
        name={'applyNewTraining'}
        initialParams={params}
        component={SubmitTraining}
        options={{headerTitle: 'Submit Training'}}
      />
      <TrainingStack.Screen
        name={'appliedTraining'}
        initialParams={params}
        component={SubmitTask}
        options={{headerTitle: 'Applied Training'}}
      />
      <TrainingStack.Screen
        name={'trainingCanadents'}
        initialParams={params}
        component={TrainingCanandents}
        options={{headerTitle: 'Training Canadents'}}
      />
      <TrainingStack.Screen
        name={'trainingApply'}
        initialParams={params}
        component={TrainingApply}
        options={{headerTitle: 'Apply For Training'}}
      />
      <TrainingStack.Screen
        name={'trainingHistory'}
        initialParams={params}
        component={TrainingHistory}
        options={{headerTitle: 'Training History'}}
      />
    </TrainingStack.Navigator>
  );
}
