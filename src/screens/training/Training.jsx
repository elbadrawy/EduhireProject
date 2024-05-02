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

export default function Training({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const {userDetails} = route.params;

  const getCompanyInfo = async companyID => {
    const document = await companyID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchJobs = async () => {
        try {
          let querySnapshot;
          if (userDetails.type === '2') {
            const userRef = await firestore()
              .collection('Users')
              .doc(userDetails.uid);
            querySnapshot = await firestore()
              .collection('Training')
              .where('companyID', '==', userRef)
              .get();
          } else {
            querySnapshot = await firestore().collection('Training').get();
          }
          const jobsPromises = querySnapshot.docs.map(
            async documentSnapshot => {
              let companyData = await getCompanyInfo(
                documentSnapshot.data().companyID,
              );
              return {
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                company: {...companyData},
              };
            },
          );
          const jobsData = await Promise.all(jobsPromises);
          setJobs(jobsData);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }
  return (
    <Container>
      <FlatList
        data={jobs}
        style={{flex: 1, padding: 15}}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text h3>
              {userDetails.type === '2' ? 'My Trainings' : 'Trainings'}
            </Text>
            {userDetails.type === '2' ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => navigation.push('trainingCanadents')}>
                  <Icon source={'file-document-edit-outline'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.push('applyNewTraining')}>
                  <Icon source={'plus'} size={25} />
                </TouchableOpacity>
              </View>
            ) : (
              userDetails.type === '1' && (
                <TouchableOpacity
                  onPress={() => navigation.push('appliedTraining')}
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
            <Text>No Trainings Available Yet</Text>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{padding: 15, backgroundColor: '#fff', margin: 10}}>
            <Text h4>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item?.company?.companyInfo?.name}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}
