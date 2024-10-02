import React, {Component} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import getToken from '../api/getToken';
import checkLogin from '../api/checkLogin';

export default class AuthLoadingScreen extends Component{
  
  constructor(props){
    super(props);
    this._loadData();
  }

  render(){
    return(
      <View style={ styles.container }>
      <ActivityIndicator />
      
      </View>
    );
  }


  _loadData = async() => {

    const getToken = getToken()
    .then(token => {
      checkLogin(token)
      console.log('TOKEN', token)
    })
    .then( (res) => { 
      console.log('RES', res)
      this.props.navigation.navigate( res.status === 'SUCCESS' ? 'login' : 'events' ); 
    } )
    .catch(err => this.props.navigation.navigate('Auth') );

    console.log('RETURN', getToken);

  }
  
}



const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#c0d6f1'
    },
    
});
