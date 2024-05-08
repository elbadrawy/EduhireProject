/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Container from '../Container';
import {Text, Divider} from '@rneui/themed';
import reactotron from 'reactotron-react-native';
import {Icon} from 'react-native-paper';

export default function Training({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const {userDetails} = route.params;

  const getCompanyInfo = async companyID => {
    const document = await companyID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainings();
    });
    return unsubscribe;
  }, []);

  const fetchTrainings = async () => {
    try {
      let querySnapshot;
      if (userDetails.type === '2') {
        const userRef = await firestore()
          .collection('Users')
          .doc(userDetails.uid);
        querySnapshot = await firestore()
          .collection('Training')
          .where('companyID', '==', userRef)
          .get();
      } else {
        querySnapshot = await firestore().collection('Training').get();
      }
      const jobsPromises = querySnapshot.docs.map(async documentSnapshot => {
        let companyData = await getCompanyInfo(
          documentSnapshot.data().companyID,
        );
        return {
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
          company: {...companyData},
        };
      });
      const jobsData = await Promise.all(jobsPromises);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }

  const renderTrainingItem = ({item}) => {
    if (userDetails.type === '2') { //Company View
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.push('trainingCanadents', {
              training: item,
            })
          }
          style={styles.companyTrainingHolder}>
          <View style={{maxWidth: 300, }}>
            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', marginBottom:10,}}>
                <Text h4>{item.title}</Text>
                <TouchableOpacity onPress={() => deleteTraining(item?.key)} style={styles.deleteIcon}>
                <Icon source={'delete'} size={24} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={{marginBottom:20}}>{item.description}</Text>
            <Text style={styles.companyName}>{item?.company?.companyInfo?.name}</Text>
          </View>
        
        </TouchableOpacity>
      );
    } else if (userDetails.type === '1') { // Student View
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.push('trainingApply', {
              training: item,
            })
          }
          style={styles.trainingHolderStudent}>
          <Text h4>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.companyName}>{item?.company?.companyInfo?.name}</Text>
        </TouchableOpacity>
      );
    } else { // Mentor View 
      return (
        <View style={styles.trainingHolderStudent}>
          <Text h4 h4Style={{borderBottomWidth:1, paddingBottom:3, borderBottomColor:'rgba(0,0,0,0.2)', marginBottom:5,}}>{item.title}</Text>
          <View style={styles.trainingBody}>
            <Text>{item.description}</Text>
            <Text style={styles.companyNameMentor}>{item?.company?.companyInfo?.name}</Text>
          </View>
        </View>
      );
    }
  };

  const deleteTraining = async trainingID => {
    Alert.alert('alert', 'Are you sure you want to delete this training ?', [
      {
        text: 'Sure',
        onPress: async () => {
          await firestore()
            .collection('Training')
            .doc(trainingID)
            .delete()
            .then(() => {
              fetchTrainings();
            })
            .catch(e => {
              reactotron.log('error', e);
            });
        },
        style: 'cancel',
      },
      {text: 'Cancel', onPress: () => null},
    ]);
  };

  return (
    <Container>
      <FlatList
        data={jobs}
        style={{flex: 1, padding: 15}}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text h3>
              {userDetails.type === '2' ? 'My Trainings' : 'Trainings'}
            </Text>
            {userDetails.type === '2' ? (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => navigation.push('applyNewTraining')}>
                  <Icon source={'plus'} size={25} />
                </TouchableOpacity>
              </View>
            ) : (
              userDetails.type === '1' && (
                <TouchableOpacity
                  onPress={() => navigation.push('trainingHistory')}
                  style={{flexDirection: 'row'}}>
                  <Icon source={'history'} size={25} />
                </TouchableOpacity>
              )
            )}
          </View>
        )}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text>No Trainings Available Yet</Text>
          </View>
        )}
        renderItem={renderTrainingItem}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  trainingHolderStudent:{
    borderWidth: 2,
    borderColor:'rgba(0,0,0,0.2)',
    // marginBottom:10,
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 30,
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:10,
  },
  companyTrainingHolder:{
    borderWidth: 2,
    borderColor:'rgba(0,0,0,0.2)',
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 30,
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:10,
    height:150,
    // justifyContent:'space-between'
  
  },
  deleteIcon:{
    position:'relative',
    left:35,
    top:6,
  },
  companyName:{
    width:100,
    minWidth: 100,
    maxWidth: 200,
    textAlign: 'center',
    marginTop: 10,
    padding: 8,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 60,
    backgroundColor: '#305538',
    color: 'white',
  },

  companyNameMentor:{
    width:100,
    minWidth: 100,
    maxWidth: 200,
    textAlign: 'center',
    // marginTop: 20,
    position:'relative',
    top:15,
    padding: 8,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 60,
    backgroundColor: '#305538',
    color: 'white'
  },

  trainingBody:{
    // height:'80%',
    // borderWidth:2,
    justifyContent:'space-between',
    padding:5,
  }
})