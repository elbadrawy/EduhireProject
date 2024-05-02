import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './Jobs.style';
import Toast from 'react-native-toast-message';
import {Text} from '@rneui/themed';

export default function JobApply({route, navigation: {goBack}}) {
  const [coverLetter, setCoverLatter] = useState();
  const [resumeLink, setResumeLink] = useState();
  const {params} = route;

  const _submitJob = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    const jobRef = await firestore().collection('Jobs').doc(params?.job?.key);
    let JobData = {
      coverLetter,
      resume: resumeLink,
      jobID: jobRef,
      studentID: userRef,
    };
    firestore()
      .collection('JobApply')
      .doc()
      .set(JobData)
      .then(() => {
        showToast();
        goBack();
      });
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Job Applied!',
      text2: 'You have been applied for the Job successfully!',
      position: 'bottom',
    });
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={[styles.containerStyle, {padding: 15}]}>
      <View style={{flex: 1, width: '100%'}}>
        <Text h3 style={{marginBottom: 30}}>
          {params?.job.title}
        </Text>
        <Input
          placeholder="Cover Latter"
          style={{height: 100}}
          multiline
          value={coverLetter}
          onChangeText={v => setCoverLatter(v)}
        />
        <Input
          placeholder="Resume Link"
          value={resumeLink}
          onChangeText={v => setResumeLink(v)}
        />
      </View>

      <Button title="Submit" onPress={() => _submitJob()} />
    </ScrollView>
  );
}
