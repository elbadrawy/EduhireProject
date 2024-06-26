import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Button} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import styles from './Rejester.style';
import reactotron from 'reactotron-react-native';
import {Input} from 'native-base';

const data = [
  {label: 'Student', value: '1'},
  {label: 'Company', value: '2'},
  {label: 'Mentor', value: '3'},
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
  const [type, setType] = useState('1');
  const [companyName, setCompanyName] = useState();
  const [companyWeb, setCompanyWeb] = useState();
  const [companyPersonName, setCompanyPersonName] = useState();
  const [mentorName, setMentorName] = useState();
  const [mentorBio, setMentorBio] = useState();
  const [mentorJobTitle, setMentorJobTitle] = useState();

  const rejester = () => {
    const emailRegex = /^[^@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please use a Gmail account.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(x => {
        let regesterData = null;
        if (type === '1') {
          regesterData = {
            uid: x?.user?.uid,
            email: email,
            firstname: firstname,
            lastname: lastname,
            educationInfo: {
              education: education,
              major: major,
              gradDate: gradDate,
            },
            location: {
              city: city,
              country: country,
            },
            skills: {key: 'bla', value: 'bla1'},
            type: type,
          };
        } else if (type === '2') {
          regesterData = {
            uid: x?.user?.uid,
            email: email,
            companyInfo: {
              name: companyName,
              contactName: companyPersonName,
              companyWebSite: companyWeb,
            },
            location: {
              city: city,
              country: country,
            },
            type: type,
          };
        } else {
          regesterData = {
            uid: x?.user?.uid,
            email: email,
            mentorDetails: {
              name: mentorName,
              bio: mentorBio,
              jobTitle: mentorJobTitle,
            },
            type: type,
            mentorStatus: 0,
          };
        }
        firestore()
          .collection('Users')
          .doc(x?.user?.uid)
          .set(regesterData)
          .then(() => {
            navigation.navigate('PostLoginStack', {
              params: {user: x.user},
              screen: 'HomeScreen',
            });
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Alert', 'Email is rejester before please login!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Alert', 'That email address is invalid!');
        }

        Alert.alert('Alert', error);
      });
  };
  return (
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={styles.container}>
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
          style={styles.Input}
        />
        <Input   //Add Handle password to be more than 6 Char
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={v => setPassword(v)}
          style={styles.Input}
        />

       

        {type === '1' ? (
          <View>
            <Input
              placeholder="Firstname"
              value={firstname}
              onChangeText={v => setFirstname(v)}
              style={styles.Input}
            />
          

            <Input
              placeholder="Lastname"
              value={lastname}
              onChangeText={v => setLastname(v)}
              style={styles.Input}
            />
            
          </View>
        ) : type === '2' ? (
          <View>
            <Input
              placeholder="Company Name"
              value={companyName}
              onChangeText={v => setCompanyName(v)}
              style={styles.Input}
            />
           

            <Input
              placeholder="Contact Name"
              value={companyPersonName}
              onChangeText={v => setCompanyPersonName(v)}
              style={styles.Input}
            />

            

            <Input              
             placeholder="Company Website"
             value={companyWeb}
             onChangeText={v => setCompanyWeb(v)}
              style={styles.Input}
            />
           
          </View>
        ) : (
          <View>

            <Input              
              placeholder="Name"
              value={mentorName}
              onChangeText={v => setMentorName(v)}
              style={styles.Input}
            />

           

            <Input              
              placeholder="Bio"
              value={mentorBio}
              onChangeText={v => setMentorBio(v)}
              style={styles.Input}
            />
           

            <Input              
             placeholder="Job Title"
             value={mentorJobTitle}
             onChangeText={v => setMentorJobTitle(v)}
            style={styles.Input}
            />  
            
          </View>
        )}
        {type !== '3' && (
          <>
            <Input              
             placeholder="country"
             value={country}
             onChangeText={v => setCountry(v)}
             style={styles.Input}
            />

         

            <Input              
             placeholder="city"
             value={city}
             onChangeText={v => setCity(v)}
             style={styles.Input}
            />

            
          </>
        )}
        {type === '1' && (
          <View>

            <Input              
             placeholder="major"
             value={major}
             onChangeText={v => setMajor(v)}
             style={styles.Input}
            />

           

            <Input              
             placeholder="education"
             value={education}
             onChangeText={v => setEducation(v)}
             style={styles.Input}
            />


            <Input              
             placeholder="gradDate, (dd/mm/yyyy)"
             value={gradDate}
             onChangeText={v => setGradDate(v)}
             style={styles.Input}
            />
            

            <Input              
             placeholder="skills ( seperate by , )"
             value={skills}
             onChangeText={v => setSkills(v)}
             style={styles.Input}
            />
           
          </View>
        )}

        <Button
          title="Rejester"
          onPress={() => rejester()}
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: '#003049',
            padding: 10,
            type: 'outline',
          }}
        />
      </View>
    </ScrollView>
  );
}
