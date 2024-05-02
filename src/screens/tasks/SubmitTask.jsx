import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './tasks.style';
import reactotron from 'reactotron-react-native';
import {Dropdown} from 'react-native-element-dropdown';

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
    <ScrollView style={{flex: 1}} contentContainerStyle={styles.containerStyle}>
      <View style={{width: '100%', padding: 15}}>
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
        />
        <Input
          placeholder="Task Description"
          style={{height: 100}}
          multiline
          value={description}
          onChangeText={v => setDescription(v)}
        />
        <Input
          placeholder="Student Major"
          value={major}
          onChangeText={v => setMajor(v)}
        />
        <Input
          placeholder="Task Attachment URL"
          value={attachmentURL}
          onChangeText={v => setAttachmentURL(v)}
        />
        <Button title="Submit" onPress={() => _submitTask()} />
      </View>
    </ScrollView>
  );
}
