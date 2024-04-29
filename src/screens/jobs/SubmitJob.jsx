import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './Jobs.style';
import reactotron from 'reactotron-react-native';

export default function SubmitJob({route, navigation: {goBack}}) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [education, setEducation] = useState();
  const [skills, setSkills] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const {params} = route;
  reactotron.log(params);

  const _submitJob = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    let JobData = {
      title,
      description,
      location: [city, country],
      requirements: {
        education: education.split(','),
        skills: skills.split(','),
      },
      companyID: userRef,
      postDate: firestore.FieldValue.serverTimestamp(),
    };
    firestore()
      .collection('Jobs')
      .doc()
      .set(JobData)
      .then(() => goBack());
  };
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={{width: '100%', padding: 15}}>
        <Input
          placeholder="Job Title"
          value={title}
          onChangeText={v => setTitle(v)}
        />
        <Input
          placeholder="Job Description"
          value={description}
          onChangeText={v => setDescription(v)}
        />
        <Input
          placeholder="Job Country"
          value={country}
          onChangeText={v => setCountry(v)}
        />
        <Input
          placeholder="Job City"
          value={city}
          onChangeText={v => setCity(v)}
        />
        <Input
          placeholder="Required Skills (Comma Separator)"
          value={skills}
          onChangeText={v => setSkills(v)}
        />
        <Input
          placeholder="Required Eductaion (Comma Separator)"
          value={education}
          onChangeText={v => setEducation(v)}
        />
        <Button title="Submit" onPress={() => _submitJob()} />
      </View>
    </ScrollView>
  );
}
