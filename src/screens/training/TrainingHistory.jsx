/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

export default function TrainingHistory({route, navigation}) {
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [trainingHistoryData, setTrainingHistoryData] = useState([]);

  const getTainingInfo = async TainingID => {
    const document = await TainingID.get();
    return document.data();
  };

  const getCompanyInfo = async companyID => {
    const document = await companyID.get();
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
        .collection('TrainingApply')
        .where('studentID', '==', userRef)
        .get();

      const trainingHistoryPromises = querySnapshot.docs.map(
        async documentSnapshot => {
          let trainingData = await getTainingInfo(
            documentSnapshot.data().trainingID,
          );
          let companyData = await getCompanyInfo(trainingData.companyID);
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            training: {...trainingData},
            company: companyData,
          };
        },
      );
      const trainingsHistoryData = await Promise.all(trainingHistoryPromises);
      setTrainingHistoryData(trainingsHistoryData);
    } catch (error) {
      console.error('Error fetching Training applying:', error);
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
    const {training, company} = item;
    return (
      <View style={{padding: 15, backgroundColor: '#fff', margin: 10}}>
        <Text h4>
          <Text h4 style={{fontWeight: '600', fontSize: 18}}>
            Job Title:
          </Text>{' '}
          {training.title}
        </Text>
        <Text>
          <Text style={{fontWeight: '600', fontSize: 18}}>Company Email:</Text>{' '}
          <Text
            style={{color: 'blue'}}
            onPress={() => showToast(company.email)}>
            {company.email}
          </Text>
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
      data={trainingHistoryData}
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
          <Text h3>Job applied history</Text>
        </View>
      )}
      // eslint-disable-next-line react/no-unstable-nested-components
      ListEmptyComponent={() => (
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <Text>No Training applied Yet!</Text>
        </View>
      )}
      renderItem={renderStudentItem}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
