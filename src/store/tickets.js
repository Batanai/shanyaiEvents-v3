import {createSlice} from '@reduxjs/toolkit';
import {apiCallBegan} from './api';
import moment from 'moment';
import {createSelector} from 'reselect';

let lastId = 0;

const slice = createSlice({
  name: 'tickets',
  initialState: {
    ticket: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    // action => action handler
    ticketAdded: (tickets, action) => {
      tickets.push({
        id: ++lastId,
        name: action.payload.name,
      });
    },

    ticketRequested: (tickets, action) => {
      tickets.loading = true;
    },

    ticketSuccess: (tickets, action) => {
      tickets.ticket = action.payload;
      tickets.loading = false;
      tickets.lastFetch = Date.now();
    },

    ticketRequestFailed: (users, action) => {
      tickets.loading = false;
    },

    sendTicket: (tickets, action) => {
      tickets.loading = true;
      if (tickets.ticket.length > 0) tickets.ticket = [];

      tickets.ticket.push(action.payload);
      tickets.loading = false;
    },

    resetTicket: (tickets, action) => {
      tickets.loading = true;
      tickets.ticket = [];
      tickets.loading = false;
    },
  },
});

export const {
  sendTicket,
  resetTicket,
  ticketAdded,
  ticketRequested,
  ticketRequestFailed,
  ticketSuccess,
} = slice.actions;
export default slice.reducer;

// export const selectUser = (state) => {
//   state.entities.users.user[0]
//   // console.log(state.entities.users.user[0])
// };

export const selectTicket = createSelector(
  state => state.entities.tickets,
  state => state.entities.projects,
  (tickets, projects) => tickets.ticket,
);

const url = '/wp-json/meup/v1/validate_ticket';

//action creators
export const sendingTicket = ticket =>
  apiCallBegan({
    url,
    method: 'post',
    data: ticket,
    onSuccess: sendTicket.type,
  });
