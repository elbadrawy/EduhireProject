import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button, Icon} from '@rneui/themed';
import styles from './Training.style';
import Toast from 'react-native-toast-message';
import {Text} from '@rneui/themed';
import { Textarea} from 'native-base';


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
      contentContainerStyle={[styles.containerStyle,]}>
     
      <Text h3 style={{marginBottom: 30, width:'100%', textAlign:'center', color:'#fff'}}>
          {params?.training.title}
        </Text>
      <View style={styles.formHolder}>

        
        <Textarea
          placeholder="Cover Latter"
          style={styles.coverLetter}
          multiline
          value={coverLetter}
          onChangeText={v => setCoverLatter(v)}
        />
        <Input
          placeholder="Resume Link"
          value={resumeLink}
          onChangeText={v => setResumeLink(v)}
          leftIcon={<Icon name="link" size={20}/>}
        />

        <Button title="Submit" 
         onPress={() => _submitTraining()}
         buttonStyle={{borderRadius:20, width:100, backgroundColor:'#305538' }}
         />
      </View>

      
    </ScrollView>
  );
}
