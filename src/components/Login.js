import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {loggedOut, loggingIn} from '../store/users';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {selectUser} from '../store/users';

const Login = () => {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const navigation = useNavigation();
  const navigationOptions = {
    title: 'Log In',
  };

  useEffect(() => {
    dispatch(loggedOut());
  }, []);

  const loggedInUser = useSelector(selectUser);

  const user = {
    user: userInput,
    pass: passInput,
  };

  const login = () => {
    dispatch(loggingIn(user));
  };

  //toast
  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Login was successful',
      text2: loggedInUser[0]?.msg,
      autoHide: true,
      visibilityTime: 3000,
      position: 'top',
      topOffset: 300,
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Login Error',
      text2: loggedInUser[0]?.msg,
      autoHide: true,
      visibilityTime: 3000,
      position: 'top',
      topOffset: 300,
    });
  };

  const showNoToast = () => {};

  useEffect(() => {
    if (loggedInUser === []) {
      showNoToast();
    } else if (loggedInUser[0]?.status === 'SUCCESS') {
      showSuccessToast();
    } else if (loggedInUser[0]?.status === 'FAIL') {
      showErrorToast();
      setPassInput('');
    }
  }, [loggedInUser]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={10}>
        <ScrollView style={{height: 90, paddingTop: 25}}>
          <TextInput
            style={styles.input}
            placeholder="User"
            autoCapitalize="none"
            onChangeText={user => setUserInput(user)}
            value={userInput}
            placeholderTextColor="#c9c8c3"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={pass => setPassInput(pass)}
            value={passInput}
            secureTextEntry
            keyboardType="default"
            placeholderTextColor="#c9c8c3"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              login();
            }}>
            <Text style={styles.btn_text}>Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#c0d6f1',
  },
  input: {
    height: 40,
    width: 250,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000000',
  },
  btn: {
    height: 40,
    width: 120,
    backgroundColor: '#e86c60',
    borderColor: '#e86c60',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
  },
});
