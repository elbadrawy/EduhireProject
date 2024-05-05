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
import {Chip} from '@rneui/themed';

export default function UsersList({route, navigation}) {
  const {userDetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsers();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchUsers = async (tab = null) => {
    try {
      tab && setActiveTab(tab);
      setUsers([]);
      const querySnapshot = await firestore()
        .collection('Users')
        .where('type', '==', tab || activeTab)
        .get();
      const UsersData = querySnapshot.docs.map(doc => doc.data());
      setUsers(UsersData);
    } catch (error) {
      console.error('Error fetching Users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1, alignSelf: 'center'}} />;
  }

  const renderUserItem = ({item}) => {
    if (activeTab === '1') {
      return (
        <View style={styles.itemContainer}>
          <View style={{maxWidth: 300}}>
            <Text h4>
              {item?.firstname} {item?.lastname}
            </Text>
            <Text>
              {item?.educationInfo?.education}, {item?.educationInfo?.major},{' '}
              {item?.educationInfo?.gradDate}
            </Text>
            <Text>
              {item?.location?.country}, {item?.location?.city}
            </Text>
            <Text>{item?.email}</Text>
          </View>
          <TouchableOpacity onPress={() => blockUser(item?.uid, item.blocked)}>
            <Icon
              source={item.blocked === '1' ? 'account-lock-open' : 'cancel'}
              size={24}
              color="red"
            />
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === '2') {
      return (
        <View style={styles.itemContainer}>
          <View style={{maxWidth: 300}}>
            <Text h4>{item?.companyInfo?.name}</Text>
            <Text>{item?.companyInfo?.companyWebSite}</Text>
            <Text>
              {item?.location?.country}, {item?.location?.city}
            </Text>
            <Text>{item?.email}</Text>
          </View>
          <TouchableOpacity onPress={() => blockUser(item?.uid, item.blocked)}>
            <Icon
              source={item.blocked === '1' ? 'account-lock-open' : 'cancel'}
              size={24}
              color="red"
            />
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === '3') {
      return (
        <View style={styles.itemContainer}>
          <View style={{maxWidth: 300}}>
            <Text h4>{item?.mentorDetails?.name}</Text>
            <Text>{item?.mentorDetails?.jobTitle}</Text>
            <Text>{item?.mentorDetails?.bio}</Text>
            <Text>{item?.email}</Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => blockUser(item?.uid, item.blocked)}>
              <Icon
                source={item.blocked === '1' ? 'account-lock-open' : 'cancel'}
                size={24}
                color="red"
              />
            </TouchableOpacity>
            {item?.mentorStatus !== '1' && (
              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={() => approveMentor(item?.uid)}>
                <Icon source={'check'} size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const blockUser = async (userID, blockedStatus) => {
    Alert.alert(
      'alert',
      !blockedStatus
        ? 'Are you sure you want to block this user ?'
        : 'Are you sure you want to unblock this user ?',
      [
        {
          text: 'Sure',
          onPress: async () => {
            await firestore()
              .collection('Users')
              .doc(userID)
              .set(
                {
                  blocked: blockedStatus === '1' ? '0' : '1',
                },
                {merge: true},
              )
              .then(() => {
                fetchUsers();
              })
              .catch(e => {
                reactotron.log('error', e);
              });
          },
          style: 'cancel',
        },
        {text: 'Cancel', onPress: () => null},
      ],
    );
  };

  const approveMentor = async userID => {
    Alert.alert('alert', 'Are you sure you want to approve this mentor ?', [
      {
        text: 'Sure',
        onPress: async () => {
          await firestore()
            .collection('Users')
            .doc(userID)
            .set(
              {
                mentorStatus: '1',
              },
              {merge: true},
            )
            .then(() => {
              fetchUsers();
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

  const handleTabPress = tab => {
    if (activeTab === tab) {
      return null;
    } else {
      fetchUsers(tab);
    }
  };

  const renderTopTaps = () => {
    return (
      <View style={styles.container}>
        <Chip
          title="Students"
          type={activeTab === '1' ? 'solid' : 'outline'}
          onPress={() => handleTabPress('1')}
        />
        <Chip
          title="Mentors"
          type={activeTab === '3' ? 'solid' : 'outline'}
          onPress={() => handleTabPress('3')}
        />
        <Chip
          title="Companies"
          type={activeTab === '2' ? 'solid' : 'outline'}
          onPress={() => handleTabPress('2')}
        />
      </View>
    );
  };

  return (
    <Container>
      <FlatList
        data={users}
        style={{flex: 1, padding: 15}}
        contentContainerStyle={{paddingBottom: 50}}
        ListHeaderComponent={() => renderTopTaps()}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Text>No Users Available Yet</Text>
          </View>
        )}
        renderItem={renderUserItem}
        ItemSeparatorComponent={() => <Divider />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
