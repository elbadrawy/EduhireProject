import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, StyleSheet, } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Button} from '@rneui/themed';
import styles from './tasks.style';
import reactotron from 'reactotron-react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Input} from 'native-base';

const difficuiltLevelsData = [
  {label: 'Easy', value: '0'},
  {label: 'Medium', value: '1'},
  {label: 'Hard', value: '2'},
];

export default function SubmitTask({route, navigation: {goBack}}) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [difficiultyLevel, setDifficiultyLevel] = useState();
  const [major, setMajor] = useState();
  const [attachmentURL, setAttachmentURL] = useState();

  useEffect(() => {}, []);

  const {params} = route;

  const _submitTask = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    let taskData = {
      title,
      description,
      difficiultyLevel,
      major,
      mentorID: userRef,
      attachment: attachmentURL,
    };
    firestore()
      .collection('Tasks')
      .doc()
      .set(taskData)
      .then(() => goBack());
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor:'#003049'}} contentContainerStyle={styles.containerStyle}>
      <View style={submitTaskStyles.holder}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={difficuiltLevelsData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Task Difficiulty Level"
          searchPlaceholder="Search..."
          value={difficiultyLevel}
          onChange={item => {
            setDifficiultyLevel(item.value);
          }}
        />
        <Input
          placeholder="Task Title"
          value={title}
          onChangeText={v => setTitle(v)}
          style={submitTaskStyles.input}
        />
        <Input
          placeholder="Task Description"
          style={submitTaskStyles.input}
          multiline
          value={description}
          onChangeText={v => setDescription(v)}
          

        />
        <Input
          placeholder="Student Major"
          value={major}
          onChangeText={v => setMajor(v)}
          style={submitTaskStyles.input}
        />
        <Input
          placeholder="Task Attachment URL"
          value={attachmentURL}
          onChangeText={v => setAttachmentURL(v)}
          style={submitTaskStyles.input}
        />
        <Button title="Submit" onPress={() => _submitTask()}  
          buttonStyle={{
            borderRadius: 20,
            width: 100,
            backgroundColor: '#003049',
          }}
        />
      </View>
    </ScrollView>
  );
}

const submitTaskStyles = StyleSheet.create({
  holder: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop:70,
    borderWidth: 2,
    borderColor:'rgba(0,0,0,0.09)',
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
  taskDescription:{
    borderWidth:1,
    width:"100%",
    minHeight:100,
    maxHeight:250,
  }
})