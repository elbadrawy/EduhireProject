import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './Rejester.style';

const data = [
  {label: 'student', value: '1'},
  {label: 'company', value: '2'},
  {label: 'mentor', value: '3'},
];

export default function Rejester({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [major, setMajor] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [education, setEducation] = useState();
  const [skills, setSkills] = useState();
  const [gradDate, setGradDate] = useState();
  const [type, setType] = useState();

  const rejester = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(x => {
        firestore()
          .collection('Users')
          .doc(x?.user?.uid)
          .set({
            uid: x?.user?.uid,
            firstname: firstname,
            lastname: lastname,
            major: major,
            city: city,
            country: country,
            education: education,
            skills: {key: 'bla', value: 'bla1'},
            gradDate: gradDate,
            type: type,
          })
          .then(() => {
            navigation.navigate('PostLoginStack', {
              params: {user: x.user},
              screen: 'HomeScreen',
            });
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email is rejester before please login!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }

        Alert.alert(error);
      });
  };
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={{width: '100%', padding: 15}}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={type}
          onChange={item => {
            setType(item.value);
          }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={v => setEmail(v)}
        />
        <Input
          placeholder="Password"
          value={password}
          //secureTextEntry={true}
          onChangeText={v => setPassword(v)}
        />
        <Input
          placeholder="Firstname"
          value={firstname}
          onChangeText={v => setFirstname(v)}
        />
        <Input
          placeholder="Lastname"
          value={lastname}
          onChangeText={v => setLastname(v)}
        />
        <Input
          placeholder="country"
          value={country}
          onChangeText={v => setCountry(v)}
        />
        <Input placeholder="city" value={city} onChangeText={v => setCity(v)} />
        <Input
          placeholder="major"
          value={major}
          onChangeText={v => setMajor(v)}
        />
        <Input
          placeholder="education"
          value={education}
          onChangeText={v => setEducation(v)}
        />
        <Input
          placeholder="gradDate"
          value={gradDate}
          onChangeText={v => setGradDate(v)}
        />
        <Input
          placeholder="skills"
          value={skills}
          onChangeText={v => setSkills(v)}
        />
        <Button title="Rejester" onPress={() => rejester()} />
      </View>
    </ScrollView>
  );
}
