/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider, Icon} from '@rneui/themed';
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
      <View style={styles.trainingHistory}>
        <Text h4>

          {training.title}
        </Text>
        <Text>
          <Text
            style={{color: '#3c9af8'}}
            onPress={() => showToast(company.email)}>
            <Icon name="email" color={'#0202026d'} size={15} /> {company.email}
          </Text>
        </Text>
        <Text>
          {item.coverLetter}
        </Text>
        <Text>
          
          <Text style={{color: '#3c9af8'}} onPress={() => showToast(item.resume)}>
          <Icon name="link" color={'#0202026d'} size={15} /> {item.resume}
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
          <Text h3 h3Style={{width:'100%', textAlign:'center'}}>Training applied history</Text>
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

const styles =StyleSheet.create({
  trainingHistory:{
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