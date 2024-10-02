import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {loggedOut, selectUser} from '../store/users';
import {callEvents, seletEvents} from '../store/events';
import {useNavigation} from '@react-navigation/native';

import {decodeJwt} from '../helpers/decodeJwt';
import {Shadow} from 'react-native-shadow-2';

const Events = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const navigationOptions = {
    title: 'List All Events',
  };

  const loggedInUser = useSelector(selectUser);

  useEffect(() => {
    const userInfo = decodeJwt(loggedInUser[0]?.token);
    console.log('USER DATA', userInfo);

    dispatch(callEvents(event));
  }, []);

  const events = useSelector(seletEvents);
  console.log('EVENTS', JSON.stringify(events));

  const event = {
    token: loggedInUser[0]?.token,
  };

  const logout = () => {
    dispatch(loggedOut());
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
          Choose an event
        </Text>

        <TouchableOpacity onPress={() => logout()}>
          <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {events[0]?.events?.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: index % 2 == 0 ? '#eee' : '#fcfcfc',
              padding: 5,
              margin: 5,
            }}>
            <Shadow style={{width: '100%'}}>
              <View>
                <TouchableWithoutFeedback
                  style={{height: 10}}
                  onPress={() =>
                    navigation.navigate('ListTickets', {
                      eid: parseInt(item.ID),
                      title: item.post_title,
                    })
                  }>
                  <View style={styles.item}>
                    <Text style={styles.itemindex}>{index + 1}</Text>
                    <Text style={styles.itemtext}>{item.post_title}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </Shadow>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  heading: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#f4511e',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
    padding: 15,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 20,
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  itemindex: {
    fontWeight: '600',
    fontSize: 16,
  },
  itemtext: {
    opacity: 0.7,
    fontSize: 16,
  },
});
