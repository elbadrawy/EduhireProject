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
import TaskCanadents from '../screens/tasks/TaskCanadents';
import UsersList from '../screens/users/UsersList';
import reactotron from 'reactotron-react-native';

// import Test from '../Test';

export const MainStack = createNativeStackNavigator();
export const PreLoginStack = createNativeStackNavigator();
export const PostLoginStack = createMaterialBottomTabNavigator();
export const JobStack = createNativeStackNavigator();
export const TasksStack = createNativeStackNavigator();
export const TrainingStack = createNativeStackNavigator();
export const UsersStack = createNativeStackNavigator();

// export const TestStack = createNativeStackNavigator();

export function PreLoginComponent() {
  return (
    <PreLoginStack.Navigator initialRouteName={'Login'}>
      <PreLoginStack.Screen name={'Login'}  component={LoginScreen}  />
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
    <PostLoginStack.Navigator  //Navigator (  Bottom screen )
      initialRouteName={'HomeScreen'}
      activeColor="#fff"
      inactiveColor="#fff"
      barStyle={{backgroundColor: '#002f49cb', }}
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
        name={'TasksStack'}
        headerMode="none"
        initialParams={params}
        component={TaskStackComponent}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={'black'}
              size={26}
            />
          ),
        }}
      />
      <PostLoginStack.Screen
        name={'TrainingStack'}
        headerMode="none"
        initialParams={params}
        component={TrainingStackComponent}
        options={{
          tabBarLabel: 'Training',
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="progress-pencil"
              color={'black'}
              size={26}
            />
          ),
        }}
      />


      {/* <PostLoginStack.Screen
        name={'TestStack'}
        initialParams={params}
        component={TestStackComponent}
        options={{
          tabBarLabel: 'test',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="door" color={'grey'} size={26} />
          ),
        }}
      /> */}


      {params?.userDetails?.type === '0' && (
        <PostLoginStack.Screen
          name={'UsersList'}
          headerMode="none"
          initialParams={params}
          component={UsersStackComponent}
          options={{
            tabBarLabel: 'Users',
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="account"
                color={'black'}
                size={26}
              />
            ),
          }}
        />
      )}
    </PostLoginStack.Navigator>
  );
}

// export function TestStackComponent({route}) {
//   const {params} = route;
//   return (
//     <TestStack.Navigator initialRouteName={'TestScreen'}>
//         <TestStack.Screen
//           name={'Tests'}
//           initialParams={params}
//           component={Test}
//           options={{
//             headerShown:true,
//             headerTitle:'Testsssss'
//           }}
//         />
//     </TestStack.Navigator>
//   );
// }

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
      <TrainingStack.Screen
        name={'taskCanadents'}
        initialParams={params}
        component={TaskCanadents}
        options={{headerTitle: 'Task Canadents'}}
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

export function UsersStackComponent({route}) {
  const {params} = route;
  return (
    <UsersStack.Navigator initialRouteName={'UsersScreen'}>
      <UsersStack.Screen
        name={'UsersScreen'}
        initialParams={params}
        component={UsersList}
        options={{
          headerShown: false,
        }}
      />
    </UsersStack.Navigator>
  );
}
