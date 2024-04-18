import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Container from '../Container';
import {List} from 'react-native-paper';

export default function Jobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const subscriber = firestore()
      .collection('Jobs')
      .onSnapshot(querySnapshot => {
        const jobs = [];

        querySnapshot.forEach(documentSnapshot => {
          jobs.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setJobs(jobs);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  console.log(jobs, loading);

  return (
    <Container>
      <FlatList
        data={jobs}
        style={{flex: 1}}
        renderItem={({item}) => (
          <List.Item
            title="First Item"
            description="Item description"
            left={props => <List.Icon {...props} icon="folder" />}
          />
        )}
      />
    </Container>
  );
}
