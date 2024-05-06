import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet,TextInput, AccessibilityInfo,Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button, Icon} from '@rneui/themed';
import styles from './Jobs.style';
import Toast from 'react-native-toast-message';
import {Text, } from '@rneui/themed';
import { Textarea} from 'native-base';


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
      <View style={{flex: 1, width: '100%', alignItems:'center', justifyContent:'space-around'}}>
        <Text h3 style={{marginBottom: 30}}>
          {params?.job.title}
        </Text>
      
        {/* style={applyStyles.coverLetter} */}
        <Textarea
         h={20}
         placeholder="Cover Letter"
         w="75%" maxW="300" 
         style={applyStyles.coverLetter}
         value={coverLetter}
         onChangeText={v => setCoverLatter(v)}
        >

        </Textarea>

        {/* <Input
          placeholder="Cover Latter"
          // style={applyStyles.coverLetter}
          multiline
          value={coverLetter}
          onChangeText={v => setCoverLatter(v)}
        /> */}

        <Input
          placeholder="Resume Link"
          value={resumeLink}
          onChangeText={v => setResumeLink(v)}
          leftIcon={<Icon name="link" size={20}/>}
          
        />
        <Button title="Submit" onPress={() => _submitJob()} buttonStyle={{borderRadius:20, width:100, backgroundColor:'#6750A4' }}/>
        
      </View>

      
    </ScrollView>
  );
}
const applyStyles = StyleSheet.create({
  coverLetter:{
    height:200,
    backgroundColor:'#fff',
    borderWidth:0.5,
    borderRadius:10,
    borderColor:'#525252',
    width:'100%',
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  }
})