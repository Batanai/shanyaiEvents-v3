import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './src/components/Login';
import Events from './src/components/Events';
import ListTickets from './src/components/ListTickets';
import ScanBarcode from './src/components/ScanBarcode';

import {useSelector} from 'react-redux';
import {selectUser} from './src/store/users';

const Stack = createStackNavigator();

const Navigation = () => {
  const loggedInUser = useSelector(selectUser);

  useEffect(() => {
    console.log('USER', loggedInUser);
  }, [loggedInUser]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
        initialRouteName={'Events'}>
        {loggedInUser[0]?.token ? (
          <>
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="ListTickets" component={ListTickets} />
            <Stack.Screen name="ScanBarcode" component={ScanBarcode} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
