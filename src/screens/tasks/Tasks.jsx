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

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const getMentorInfo = async mentorID => {
    const document = await mentorID.get();
    return document.data();
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        //Query here to get only tasks assigned to you or created by you if user type is mentor 
        //need auth user passed here 
        const querySnapshot = await firestore().collection('Tasks').get();
        const jobsPromises = querySnapshot.docs.map(async documentSnapshot => {
          let mentorData = await getMentorInfo(
            documentSnapshot.data().mentorID,
          );
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            mentor: {...mentorData},
          };
        });
        const jobsData = await Promise.all(jobsPromises);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching Tasks:', error);
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
        ListHeaderComponent={() => <Text h3>My Tasks</Text>}
        renderItem={({item}) => (
          <TouchableOpacity
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
