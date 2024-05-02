/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

export default function TrainingCanandents({route, navigation}) {
  const {userDetails, training} = route.params;
  const [loading, setLoading] = useState(true);
  const [trainingApplyingData, setTrainingApplyingData] = useState([]);

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
      const trainingRef = await firestore()
        .collection('Training')
        .doc(training?.key);
      querySnapshot = await firestore()
        .collection('TrainingApply')
        .where('trainingID', '==', trainingRef)
        .get();

      const jobsApplyingPromises = querySnapshot.docs.map(
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
      const trainingApplyingData = await Promise.all(jobsApplyingPromises);
      setTrainingApplyingData(trainingApplyingData);
    } catch (error) {
      console.error('Error fetching jobs applying:', error);
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
      text2: 'Resume link Coppied to your Clipboard!',
      position: 'bottom',
    });
  };

  const renderStudentItem = ({item}) => {
    const {student} = item;
    return (
      <View style={{padding: 15, backgroundColor: '#fff', margin: 10}}>
        <Text h4>
          <Text h4 style={{fontWeight: '600', fontSize: 18}}>
            Name:
          </Text>{' '}
          {student.firstname} {student.lastname}
        </Text>
        <Text>
          <Text style={{fontWeight: '600', fontSize: 18}}>CoverLatter:</Text>{' '}
          {item.coverLetter}
        </Text>
        <Text>
          <Text h6 style={{fontWeight: '600', fontSize: 18}}>
            Resume Link:
          </Text>{' '}
          <Text style={{color: 'blue'}} onPress={() => showToast(item.resume)}>
            {item.resume}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={trainingApplyingData}
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
          <Text h3>{training.title}</Text>
        </View>
      )}
      // eslint-disable-next-line react/no-unstable-nested-components
      ListEmptyComponent={() => (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Text>No applying Students for this training Yet</Text>
        </View>
      )}
      renderItem={renderStudentItem}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
