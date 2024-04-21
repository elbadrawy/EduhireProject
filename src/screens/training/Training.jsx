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

export default function Training() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const getCompanyInfo = async companyID => {
    const document = await companyID.get();
    return document.data();
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        //if user is company need to return only his training oppourtinity
        const querySnapshot = await firestore().collection('Training').get();
        const jobsPromises = querySnapshot.docs.map(async documentSnapshot => {
          let companyData = await getCompanyInfo(
            documentSnapshot.data().companyID,
          );
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            company: {...companyData},
          };
        });
        const jobsData = await Promise.all(jobsPromises);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }
  reactotron.log(jobs);
  return (
    <Container>
      <FlatList
        data={jobs}
        style={{flex: 1, padding: 15}}
        ListHeaderComponent={() => <Text h3>Trainings</Text>}
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
