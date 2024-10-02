import {createSlice} from '@reduxjs/toolkit';
import {apiCallBegan} from './api';
import moment from 'moment';
import {createSelector} from 'reselect';

let lastId = 0;

const slice = createSlice({
  name: 'users',
  initialState: {
    user: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    // action => action handler
    userAdded: (users, action) => {
      users.push({
        id: ++lastId,
        name: action.payload.name,
      });
    },

    loginRequested: (users, action) => {
      users.loading = true;
    },

    loginSuccess: (users, action) => {
      users.user = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },

    loginRequestFailed: (users, action) => {
      users.loading = false;
    },

    loggedIn: (users, action) => {
      users.loading = true;
      if (users.user.length > 0) users.user = [];

      users.user.push(action.payload);
      users.loading = false;
    },

    loggedOut: (users, action) => {
      users.loading = true;
      users.user = [];
      users.loading = false;
    },
  },
});

export const {
  loggedIn,
  loggedOut,
  userAdded,
  loginRequested,
  loginSuccess,
  loginRequestFailed,
} = slice.actions;
export default slice.reducer;

// export const selectUser = (state) => {
//   state.entities.users.user[0]
//   // console.log(state.entities.users.user[0])
// };

export const selectUser = createSelector(
  state => state.entities.users,
  state => state.entities.projects,
  (users, projects) => users.user,
);

//action creators
export const loggingIn = user =>
  apiCallBegan({
    url: '/wp-json/meup/v1/login',
    method: 'post',
    data: user,
    onSuccess: loggedIn.type,
  });
