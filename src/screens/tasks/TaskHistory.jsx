/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

export default function TaskHistory({route, navigation}) {
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [TaskHistoryData, setTaskHistoryData] = useState([]);

  const getTaskInfo = async TaskID => {
    const document = await TaskID.get();
    return document.data();
  };

  const getMentorInfo = async mentorID => {
    const document = await mentorID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchHistory = async () => {
    try {
      let querySnapshot;
      const userRef = await firestore()
        .collection('Users')
        .doc(userDetails.uid);
      querySnapshot = await firestore()
        .collection('TasksApply')
        .where('studentID', '==', userRef)
        .get();

      const taskHistoryPromises = querySnapshot.docs.map(
        async documentSnapshot => {
          let tasksData = await getTaskInfo(documentSnapshot.data().taskID);
          let mentorData = await getMentorInfo(tasksData.mentorID);
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            task: {...tasksData},
            mentor: mentorData,
          };
        },
      );
      const tasksHistoryData = await Promise.all(taskHistoryPromises);
      setTaskHistoryData(tasksHistoryData);
    } catch (error) {
      console.error('Error fetching Tasks applying:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }

  const showToast = link => {
    Clipboard.setString(link);
    Toast.show({
      type: 'success',
      text1: 'Coppied!',
      text2: 'link Coppied to your Clipboard!',
      position: 'bottom',
    });
  };

  const renderStudentItem = ({item}) => {
    const {task, mentor} = item;
    return (
      <View style={{padding: 15, backgroundColor: '#fff', margin: 10}}>
        <Text h4>
          <Text h4 style={{fontWeight: '600', fontSize: 18}}>
            Task Title:
          </Text>{' '}
          {task.title}
        </Text>
        <Text>
          <Text style={{fontWeight: '600', fontSize: 18}}>Mentor Email:</Text>{' '}
          <Text style={{color: 'blue'}} onPress={() => showToast(mentor.email)}>
            {mentor.email}
          </Text>
        </Text>
        <Text>
          <Text style={{fontWeight: '600', fontSize: 18}}>Description:</Text>{' '}
          {item.description}
        </Text>
        <Text>
          <Text h6 style={{fontWeight: '600', fontSize: 18}}>
            Attachment:
          </Text>{' '}
          <Text style={{color: 'blue'}} onPress={() => showToast(item.resume)}>
            {item.attachment}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={TaskHistoryData}
      style={{flex: 1, padding: 15}}
      contentContainerStyle={{flex: 1, paddingBottom: 50}}
      // eslint-disable-next-line react/no-unstable-nested-components
      ListHeaderComponent={() => (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <Text h3>Tasks applied history</Text>
        </View>
      )}
      // eslint-disable-next-line react/no-unstable-nested-components
      ListEmptyComponent={() => (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Text>No Tasks applied Yet!</Text>
        </View>
      )}
      renderItem={renderStudentItem}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
