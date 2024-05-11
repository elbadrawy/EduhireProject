import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Input, Button, Icon} from '@rneui/themed';
import styles from './tasks.style';
import Toast from 'react-native-toast-message';
import {Text} from '@rneui/themed';
import { Textarea} from 'native-base';


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
      style={{flex: 1, backgroundColor:'#003049'}}
      contentContainerStyle={[styles.containerStyle, ]}>
     
        
        
        <View style={taskApplyStyles.holder}>
          <Text h3 style={{marginBottom: 30, width:'100%', textAlign:'center'}}>
              {params?.task.title}
          </Text>

          <Textarea
          style={taskApplyStyles.Description}
          placeholder="Descripe how do you solve this task?"
          value={description}
          onChangeText={v => setDescription(v)}
          >

          </Textarea>
          {/* <Input
            placeholder="Descripe how do you solve this task?"
            style={{height: 100}}
            multiline
            value={description}
            onChangeText={v => setDescription(v)}
          /> */}
          <Input
            placeholder="attach task solution link"
            value={attachment}
            onChangeText={v => setAttachment(v)}
            leftIcon={<Icon name="link" size={20}/>}
          />
            <Button title="Submit" onPress={() => _submitTask()} buttonStyle={{borderRadius:20, width:100, backgroundColor:'#003049' }}/>
        </View>
     
    
    </ScrollView>
  );
}

const taskApplyStyles = StyleSheet.create({
  holder:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.07)',
    width:'100%',
    height:'90%',
    position:'absolute',
    bottom:0,
    padding:15,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    borderTopRightRadius:50,
    borderTopLeftRadius:50,
  },
  Description:{
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
