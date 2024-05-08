import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity, Pressable} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Button} from '@rneui/themed';
import styles from './Training.style';
import reactotron from 'reactotron-react-native';
import {Input} from 'native-base';

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
      <View style={styles.submitTrainingHolder}>
        <Input
          placeholder="Training Title"
          value={title}
          onChangeText={v => setTitle(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Training Description"
          value={description}
          onChangeText={v => setDescription(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Training Start Date"
          value={stratDate}
          onChangeText={v => setStratDate(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Training Country"
          value={country}
          onChangeText={v => setCountry(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Training City"
          value={city}
          onChangeText={v => setCity(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Required Skills (Comma Separator)"
          value={skills}
          onChangeText={v => setSkills(v)}
          style={styles.Input}
        />
        <Input
          placeholder="Required Eductaion"
          value={education}
          onChangeText={v => setEducation(v)}
          style={styles.Input}
        />
        <Button title="Submit" onPress={() => _submitTraining()} 
        buttonStyle={{
          borderRadius: 20,
          width: 100,
          backgroundColor: '#305538',
        }}
         />
      </View>
    </ScrollView>
  );
}
