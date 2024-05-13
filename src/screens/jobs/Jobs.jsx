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

export default function Jobs({route, navigation}) {
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const getCompanyInfo = async companyID => {
    const document = await companyID.get();
    return document.data();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchJobs();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchJobs = async () => {
    try {
      let querySnapshot;
      if (userDetails.type === '2') {
        const userRef = await firestore()
          .collection('Users')
          .doc(userDetails.uid);
        querySnapshot = await firestore()
          .collection('Jobs')
          .where('companyID', '==', userRef)
          
          .get();
      } else {
        querySnapshot = await firestore().collection('Jobs').get();
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

  const renderJobItem = ({item}) => {
    if (userDetails.type === '2') {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.push('jobCanadents', {
              job: item,
            })
          }
          style={styles.myJobList}
          >
          <View style={styles.jobHolder}>
            <Text h4 style={styles.myJobTitle}>{item.title}</Text>
            <Text style={styles.myJobDescription}>{item.description}</Text>
            <Text style={styles.companyName}>{item?.company?.companyInfo?.name}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteJob(item?.key)} style={styles.removeIcon}>
            <Icon source={'delete'} size={24} color="#b60202" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    } else if (userDetails.type === '1') {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.push('jobApply', {
              job: item,
            })
            
          }
          style={styles.studentJobView}>
          <Text h4>{item.title}</Text>
          <Divider/>
          <View style={styles.jobPostBody}>
            <Text>{item.description}</Text>
            <Text style={styles.companyName}>{item?.company?.companyInfo?.name}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.studentJobView}>
          <Text h4>{item.title}</Text>
          <View style={styles.jobPostBody}>
            <Text>{item.description}</Text>
            <Text style={styles.companyName}>{item?.company?.companyInfo?.name}</Text>
          </View>
        </View>
      );
    }
  };

  const deleteJob = async jobID => {
    Alert.alert('alert', 'Are you sure you want to delete this job ?', [
      {
        text: 'Sure',
        onPress: async () => {
          reactotron.log(jobID);
          await firestore()
            .collection('Jobs')
            .doc(jobID)
            .delete()
            .then(() => {
              fetchJobs();
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
    <Container style={{flex:1, marginTop:20,}} >
      <FlatList
        data={jobs}
        style={{flex: 1,padding: 15, }} //Entir Job screen style (BG)
        contentContainerStyle={{gap:10, paddingBottom:20, }}
        



        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
         <>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'flex-end',
                width:'100%',
                paddingBottom:15,
                
              }}>
              <Text h3>{userDetails.type === '2' ? 'My Jobs' : 'Jobs'}</Text>
              
              {userDetails.type === '2' ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => navigation.push('applyNewJob')}>
                    <Icon source={'plus'} size={25} />
                  </TouchableOpacity>
                </View>
              ) : (
                userDetails.type === '1' && (
                  <TouchableOpacity
                    onPress={() => navigation.push('jobHistory')}
                    style={{flexDirection: 'row'}}>
                    <Icon source={'history'} size={25} />
                  </TouchableOpacity>
                )
              )}
            </View>
            <Divider/>
          </>
        )}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text>No Jobs Available Yet</Text>
          </View>
        )}
        renderItem={renderJobItem}
        // ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  myJobList:{
    // borderWidth:2,
    // padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:20,
    minHeight:150,
    // backgroundColor:'black',
    
    
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    
    
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,

  },
  removeIcon:{
    position:'relative',
    bottom:50,
    // left:20,
    // right:10,
  },
  jobHolder:{ // Company
    textAlign:'center',
    alignItems:'center',
    flexDirection:'column',
    gap:15,
   
  },
  
  companyName:{
    // borderWidth:1,
    padding:8,
    borderTopRightRadius:20,
    borderBottomLeftRadius:20,
    // borderColor:"#8C14FC",
    fontWeight:'bold',
    width:100,
    textAlign:'center',
    maxWidth:250,
    color:'#fff',
    backgroundColor:'#003049'
  },
  jobTitle_Card:{
    fontSize:14,
    borderWidth:2,
  },
  studentJobView:{
    padding: 15,
    paddingBottom:0,
    // paddingLeft:15,
    // paddingRight:15,
    backgroundColor: '#fff',
    margin: 10,
    borderWidth:0.5,
    borderRadius:20,
    borderColor:'rgba(0,0,0,0.2)',
    maxHeight:250,
    // justifyContent:'space-between'
    shadowColor:"#333333", 
    shadowOfset:{
    width:10,
    height:10,
    },
    shadowOpacity:0.9,
    shadowRadius:4,
    elevation:15,
  },
  jobPostBody:{
    height:'80%',
    // borderWidth:2,
    justifyContent:'space-between',
    padding:5,


  }
})