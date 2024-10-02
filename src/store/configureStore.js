import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducer from './reducer';
import logger from './middleware/logger';
import toast from './middleware/toast';
import api from './middleware/api';
import storage from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

export default function () {
  return configureStore({
    reducer: persistedReducer,
    middleware: [
      ...getDefaultMiddleware(),
      // logger({ destination: "console" }),
      toast,
      api,
    ],
  });
}
