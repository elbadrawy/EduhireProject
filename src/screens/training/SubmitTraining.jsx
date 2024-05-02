import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './Training.style';
import reactotron from 'reactotron-react-native';

export default function SubmitTraining({route, navigation: {goBack}}) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [education, setEducation] = useState();
  const [skills, setSkills] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [stratDate, setStratDate] = useState(new Date());
  const {params} = route;

  const _submitTraining = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    let trainingData = {
      title,
      description,
      location: [city, country],
      requirements: {
        education: education,
        skills: skills.split(','),
      },
      companyID: userRef,
      stratDate,
    };
    firestore()
      .collection('Training')
      .doc()
      .set(trainingData)
      .then(() => goBack());
  };

  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={{width: '100%', padding: 15}}>
        <Input
          placeholder="Training Title"
          value={title}
          onChangeText={v => setTitle(v)}
        />
        <Input
          placeholder="Training Description"
          value={description}
          onChangeText={v => setDescription(v)}
        />
        <Input
          placeholder="Training Start Date"
          value={stratDate}
          onChangeText={v => setStratDate(v)}
        />
        <Input
          placeholder="Training Country"
          value={country}
          onChangeText={v => setCountry(v)}
        />
        <Input
          placeholder="Training City"
          value={city}
          onChangeText={v => setCity(v)}
        />
        <Input
          placeholder="Required Skills (Comma Separator)"
          value={skills}
          onChangeText={v => setSkills(v)}
        />
        <Input
          placeholder="Required Eductaion"
          value={education}
          onChangeText={v => setEducation(v)}
        />
        <Button title="Submit" onPress={() => _submitTraining()} />
      </View>
    </ScrollView>
  );
}
