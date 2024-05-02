/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Container from '../Container';
import {Text, Divider} from '@rneui/themed';
import reactotron from 'reactotron-react-native';
import {Icon} from 'react-native-paper';

export default function Tasks({route, navigation}) {
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const getMentorInfo = async mentorID => {
    const document = await mentorID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchTasks = async () => {
        try {
          //Query here to get only tasks assigned to you or created by you if user type is mentor
          //need auth user passed here
          const querySnapshot = await firestore().collection('Tasks').get();
          const tasksPromises = querySnapshot.docs.map(
            async documentSnapshot => {
              let mentorData = await getMentorInfo(
                documentSnapshot.data().mentorID,
              );
              return {
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                mentor: {...mentorData},
              };
            },
          );
          const tasksData = await Promise.all(tasksPromises);
          setTasks(tasksData);
        } catch (error) {
          console.error('Error fetching Tasks:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTasks();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }

  return (
    <Container>
      <FlatList
        data={tasks}
        style={{flex: 1, padding: 15}}
        contentContainerStyle={{paddingBottom: 50}}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text h3>{userDetails.type === '3' ? 'My Tasks' : 'Tasks'}</Text>
            {userDetails.type === '3' ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => navigation.push('solvedTasks')}
                  style={{marginRight: 10}}>
                  <Icon source={'file-document-edit-outline'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.push('applyNewTask')}>
                  <Icon source={'plus'} size={25} />
                </TouchableOpacity>
              </View>
            ) : (
              userDetails.type === '1' && (
                <TouchableOpacity
                  onPress={() => navigation.push('taskHistory')}
                  style={{flexDirection: 'row'}}>
                  <Icon source={'history'} size={25} />
                </TouchableOpacity>
              )
            )}
          </View>
        )}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text>No Tasks Available Yet</Text>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.push('taskApply', {
                task: item,
              })
            }
            style={{padding: 15, backgroundColor: '#fff', margin: 10}}>
            <Text h4>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item?.mentor?.mentorDetails?.name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}
