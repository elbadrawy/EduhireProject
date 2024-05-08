/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider, Icon} from '@rneui/themed';
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
      <View style={styles.taskHistoryholder}>
        <Text h4 h4Style={{ 
            fontSize: 20,
            width: '100%',
            textAlign: 'center',
            borderBottomWidth: 0.5,
            paddingBottom: 5,
            paddingTop: 0,
            marginBottom: 5,}}>
          {task.title}
        </Text>
        <Text>
          
          <Text style={{color: '#3c9af8'}} onPress={() => showToast(mentor.email)}>
            <Icon name="email" color={'#0202026d'} size={15} />  {mentor.email}
          </Text>
        </Text>
        <Text>
          
          {item.description}
        </Text>
        <Text>
          
          <Text style={{color: '#3c9af8'}} onPress={() => showToast(item.resume)}>
          <Icon name="link" color={'#0202026d'} size={15} /> {item.attachment}
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
          <Text h3 h3Style={{width:'100%', textAlign:'center', }}>Tasks applied history</Text>
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

const styles = StyleSheet.create({
  taskHistoryholder:{
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    gap: 10,
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.09)',
    shadowColor: '#333333',
    shadowOfset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 10,

  }
})
