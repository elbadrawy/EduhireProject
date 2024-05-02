import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button} from '@rneui/themed';
import styles from './tasks.style';
import Toast from 'react-native-toast-message';
import {Text} from '@rneui/themed';

export default function TaskApply({route, navigation: {goBack}}) {
  const [description, setDescription] = useState();
  const [attachment, setAttachment] = useState();
  const {params} = route;

  const _submitTask = async () => {
    const userRef = await firestore()
      .collection('Users')
      .doc(params?.userDetails?.uid);
    const taskRef = await firestore()
      .collection('Tasks')
      .doc(params?.task?.key);
    let taskData = {
      description,
      attachment,
      taskID: taskRef,
      studentID: userRef,
    };
    firestore()
      .collection('TasksApply')
      .doc()
      .set(taskData)
      .then(() => {
        showToast();
        goBack();
      });
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Task Applied!',
      text2: 'You have been applied for the Task successfully!',
      position: 'bottom',
    });
  };

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={[styles.containerStyle, {padding: 15}]}>
      <View style={{flex: 1, width: '100%'}}>
        <Text h3 style={{marginBottom: 30}}>
          {params?.task.title}
        </Text>
        <Input
          placeholder="Descripe how do you solve this task?"
          style={{height: 100}}
          multiline
          value={description}
          onChangeText={v => setDescription(v)}
        />
        <Input
          placeholder="attach task solution link"
          value={attachment}
          onChangeText={v => setAttachment(v)}
        />
      </View>

      <Button title="Submit" onPress={() => _submitTask()} />
    </ScrollView>
  );
}
