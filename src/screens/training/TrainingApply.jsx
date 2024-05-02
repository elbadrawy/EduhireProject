import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './Training.style';
import Toast from 'react-native-toast-message';
import {Text} from '@rneui/themed';

export default function TrainingApply({route, navigation: {goBack}}) {
  const [coverLetter, setCoverLatter] = useState();
  const [resumeLink, setResumeLink] = useState();
  const {params} = route;

  const _submitTraining = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    const trainingRef = await firestore()
      .collection('Training')
      .doc(params?.training?.key);
    let trainingData = {
      coverLetter,
      resume: resumeLink,
      trainingID: trainingRef,
      studentID: userRef,
    };
    firestore()
      .collection('TrainingApply')
      .doc()
      .set(trainingData)
      .then(() => {
        showToast();
        goBack();
      });
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Training Applied!',
      text2: 'You have been applied for the Training successfully!',
      position: 'bottom',
    });
  };

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={[styles.containerStyle, {padding: 15}]}>
      <View style={{flex: 1, width: '100%'}}>
        <Text h3 style={{marginBottom: 30}}>
          {params?.training.title}
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

      <Button title="Submit" onPress={() => _submitTraining()} />
    </ScrollView>
  );
}
