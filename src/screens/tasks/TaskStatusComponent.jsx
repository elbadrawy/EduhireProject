import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import reactotron from 'reactotron-react-native';

const TaskStatusBox = ({difficultyLevel}) => {
  let color, label;
  switch (difficultyLevel) {
    case '0':
      color = 'green';
      label = 'Easy';
      break;
    case '1':
      color = 'orange';
      label = 'Medium';
      break;
    case '2':
      color = 'red';
      label = 'Hard';
      break;
    default:
      color = 'gray';
      label = 'Unknown';
  }

  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TaskStatusBox;
