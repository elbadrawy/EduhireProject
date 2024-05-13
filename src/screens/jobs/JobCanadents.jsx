/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, FlatList, ScrollView, StyleSheet, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Text, Divider, Icon} from '@rneui/themed';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';

export default function JobCanadents({route, navigation}) {
  const {userDetails, job} = route.params;
  const [loading, setLoading] = useState(true);
  const [jobsApplyingData, setJobsApplyingData] = useState([]);

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
      const jobRef = await firestore().collection('Jobs').doc(job?.key);
      querySnapshot = await firestore()
        .collection('JobApply')
        .where('jobID', '==', jobRef)
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
      const jobsApplyingData = await Promise.all(jobsApplyingPromises);
      setJobsApplyingData(jobsApplyingData);
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
      <View style={styles.candidates}>
        <Text h4 style={styles.candidateName}>
          <Icon name="person" color={'black'} size={20} /> {student.firstname}{' '}
          {student.lastname}
        </Text>
        <Text>{item.coverLetter}</Text>
        <Text style={styles.resumeLink}>
          <Text
            style={{color: '#3c9af8'}}
            onPress={() => showToast(item.resume)}>
            <Icon name="link" color={'#0202026d'} size={15} /> {item.resume}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <>
      
      <View style={styles.holder}>
      <ScrollView>
          <Text h3 style={styles.jobTitle}>
            {job.title}
          </Text>
            <FlatList
              data={jobsApplyingData}
              style={styles.applyingList}
              contentContainerStyle={{flex: 1, paddingBottom: 50}}
              // eslint-disable-next-line react/no-unstable-nested-components
              ListHeaderComponent={() => (
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}></View>
              )}
              // eslint-disable-next-line react/no-unstable-nested-components
              ListEmptyComponent={() => (
                <View
                  style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                  <Text>No applying Students for this job Yet</Text>
                </View>
              )}
              renderItem={renderStudentItem}
              ItemSeparatorComponent={() => <Divider />}
            />
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  holder: {
    height: '100%',
    backgroundColor: '#003049',
  },
  jobTitle: {
    // borderWidth:4,
    textAlign: 'center',
    color:'white',
    marginTop:10,
    marginBottom:10,
    alignItems:'center'
  },
  applyingList: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'rgba(0,0,0,0.07)',
    marginTop: 5,
    minHeight:700,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: '#1f1e1e',
    shadowOfset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 15,
  },
  candidates: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    minHeight: 150,
    maxHeight: 350,
    borderRadius: 20,
    shadowColor: '#1f1e1e',
    shadowOfset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 15,

    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  candidateName: {
    textAlign: 'center',
  },
  resumeLink: {},
});
