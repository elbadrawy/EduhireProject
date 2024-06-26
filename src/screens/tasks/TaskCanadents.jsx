/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider,Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';

export default function TaskCanadents({route, navigation}) {
  const {userDetails, task} = route.params;
  const [loading, setLoading] = useState(true);
  const [tasksApplyingData, setTasksApplyingData] = useState([]);

  const getStudentInfo = async studentID => {
    const document = await studentID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchApplied();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchApplied = async () => {
    try {
      let querySnapshot;
      const taskRef = await firestore().collection('Tasks').doc(task?.key);
      querySnapshot = await firestore()
        .collection('TasksApply')
        .where('taskID', '==', taskRef)
        .get();

      const tasksApplyingPromises = querySnapshot.docs.map(
        async documentSnapshot => {
          let studentData = await getStudentInfo(
            documentSnapshot.data().studentID,
          );
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            student: {...studentData},
          };
        },
      );
      const taskApplyingData = await Promise.all(tasksApplyingPromises);
      setTasksApplyingData(taskApplyingData);
    } catch (error) {
      console.error('Error fetching tasks applying:', error);
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
      text2: 'attachment link Coppied to your Clipboard!',
      position: 'bottom',
    });
  };

  const renderStudentItem = ({item}) => {
    const {student} = item;
    return (
      
        <View style={candidatStyles.holder}>
          <Text h4>
            {student.firstname} {student.lastname}         
          </Text>
          <Text>
            <Text style={{fontWeight: '600', fontSize: 16}}>Description:</Text>{' '}
            {item.description}
          </Text>
          <Text>
            
            <Text style={{color: '#3c9af8'}} onPress={() => showToast(item.resume)}>
              <Icon name="link" size={20} color={"#00000068"}/> {item.attachment}
            </Text>
          </Text>
          
        </View>
      
    );
  };

  return (
    <View style={{ backgroundColor:'#003049', }}>
      <ScrollView >
        <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <Text h3 h3Style={{width:'100%', textAlign:'center', color:'white', marginTop:10,}}>{task.title}</Text>
            </View>
        <FlatList
          data={tasksApplyingData}
          style={candidatStyles.father}
          contentContainerStyle={{flex: 1, paddingBottom: 50,}}
          // eslint-disable-next-line react/no-unstable-nested-components
          
          // eslint-disable-next-line react/no-unstable-nested-components
          ListEmptyComponent={() => (
            <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Text>No applying Students for this task Yet</Text>
            </View>
          )}
          renderItem={renderStudentItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </ScrollView>
    </View>
  );
}

const candidatStyles = StyleSheet.create({
  father:{
    // borderWidth:0,
    // borderColor:"red",
    width:'100%',
    height:'100%',
    marginTop:15,
    padding:15,
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    backgroundColor:'white',
    minHeight:700,   
  },
  holder: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderWidth:0.5,
    borderColor:"rgba(0,0,0,0.2)",
    alignItems:'center',
    borderRadius:30,
    gap:10,
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:10,
  },
});
