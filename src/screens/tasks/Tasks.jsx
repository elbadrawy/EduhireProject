/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Container from '../Container';
import {Text, Divider} from '@rneui/themed';
import reactotron from 'reactotron-react-native';
import {Icon} from 'react-native-paper';
import TaskStatusBox from './TaskStatusComponent';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';

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
      fetchTasks();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchTasks = async () => {
    try {
      //Query here to get only tasks assigned to you or created by you if user type is mentor
      //need auth user passed here
      let querySnapshot;
      if (userDetails.type === '3') {
        const userRef = await firestore()
          .collection('Users')
          .doc(userDetails.uid);
        querySnapshot = await firestore()
          .collection('Tasks')
          .where('mentorID', '==', userRef)
          .get();
      } else {
        querySnapshot = await firestore().collection('Tasks').get();
      }
      const tasksPromises = querySnapshot.docs.map(async documentSnapshot => {
        let mentorData = await getMentorInfo(documentSnapshot.data().mentorID);
        return {
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
          mentor: {...mentorData},
        };
      });
      const tasksData = await Promise.all(tasksPromises);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching Tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }

  const deleteTask = async taskID => {
    Alert.alert('alert', 'Are you sure you want to delete this Task ?', [
      {
        text: 'Sure',
        onPress: async () => {
          await firestore()
            .collection('Tasks')
            .doc(taskID)
            .delete()
            .then(() => {
              fetchTasks();
            })
            .catch(e => {
              reactotron.log('error', e);
            });
        },
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => null},
    ]);
  };

  const checkStatusAndPush = () => {
    if (userDetails.mentorStatus && userDetails.mentorStatus === '1') {
      navigation.push('applyNewTask');
    } else {
      Alert.alert(
        'alert',
        "You can't add a new task because you are not approved yet. Stay tuned!",
      );
    }
  };

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
                <TouchableOpacity onPress={checkStatusAndPush}>
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
        renderItem={({item}) => {
          if (userDetails.type === '3') {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('taskCanadents', {
                    task: item,
                  })
                }
                style={styles.taskHolder}>
                <View>
                  <View style={styles.taskHeader}>
                    <Text h4>{item.title}</Text>
                    <TaskStatusBox difficultyLevel={item.difficiultyLevel} />
                    
                  </View>
                  <CardDivider/>
                  <Text>{item.description}</Text>
                  <Text style={styles.mentorName}>
                    {item?.mentor?.mentorDetails?.name}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => deleteTask(item?.key)}>
                    <Icon source={'delete'} size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          } else if (userDetails.type === '1') {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('taskApply', {
                    task: item,
                  })
                }
                style={styles.taskHolderStudent}>
                <Text h4>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.mentorName}>
                  {item?.mentor?.mentorDetails?.name}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <View style={styles.taskHolderStudent}>
                <Text h4>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.mentorName}>
                  {item?.mentor?.mentorDetails?.name}
                </Text>
              </View>
            );
          }
        }}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  taskHolder: {
    borderWidth: 2,
    borderColor:'rgba(0,0,0,0.2)',
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30,
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:10,

  },

  taskHolderStudent:{
    borderWidth: 2,
    borderColor:'rgba(0,0,0,0.2)',
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 30,
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:10,

  },

  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    
  },
  mentorName: {
    // borderWidth:2,
    width:100,
    minWidth: 100,
    maxWidth: 200,
    textAlign: 'center',
    marginTop: 20,
    padding: 8,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 60,
    backgroundColor: '#305538',
    color: 'white',
  },
  deleteIcon:{
    position:'relative',
    right:20,
  }
});
