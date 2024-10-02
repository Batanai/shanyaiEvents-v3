import './gesture-handler';

import 'react-native-reanimated';
import { useEffect } from 'react';
import configureStore from './src/store/configureStore';
import {Provider} from 'react-redux';
import Navigation from './Navigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import Toast from 'react-native-toast-message';
import SplashScreen from "react-native-splash-screen"; //import SplashScreen
import React from 'react';

const store = configureStore();

let persistor = persistStore(store);

const App = () => {

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
        <Toast />
      </PersistGate>
    </Provider>
  );
};

export default App;