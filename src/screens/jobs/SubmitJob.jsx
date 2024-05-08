import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Button} from '@rneui/themed';
import styles from './Jobs.style';
import reactotron from 'reactotron-react-native';
import {Input} from 'native-base';

export default function SubmitJob({route, navigation: {goBack}}) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [education, setEducation] = useState();
  const [skills, setSkills] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const {params} = route;

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
    <ScrollView style={{flex: 1, backgroundColor:'#305538'}} contentContainerStyle={styles.containerStyle}>
      <View style={submitJobStyles.holder}>
        <Input
          placeholder="Job Title"
          value={title}
          onChangeText={v => setTitle(v)}
          style={submitJobStyles.input}
        />
        <Input
          placeholder="Job Description"
          value={description}
          onChangeText={v => setDescription(v)}
          style={submitJobStyles.input}
        />
        <Input
          placeholder="Job Country"
          value={country}
          onChangeText={v => setCountry(v)}
          style={submitJobStyles.input}
        />
        <Input
          placeholder="Job City"
          value={city}
          onChangeText={v => setCity(v)}
          style={submitJobStyles.input}
        />
        <Input
          placeholder="Required Skills (Comma Separator)"
          value={skills}
          onChangeText={v => setSkills(v)}
          style={submitJobStyles.input}
        />
        <Input
          placeholder="Required Eductaion (Comma Separator)"
          value={education}
          onChangeText={v => setEducation(v)}
          style={submitJobStyles.input}
        />
        <Button
          title="Submit"
          onPress={() => _submitJob()}
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

const submitJobStyles = StyleSheet.create({
  holder: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop:70,
    borderWidth: 1,
    borderColor:'rgba(0,0,0,0.2)',
    height: '100%',
    marginTop:70,
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
    backgroundColor:"#fff",
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  },
  input: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.4)',
    padding: 5,
    borderRadius: 20,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
    maxHeight: 50,
   
  
  },
});
