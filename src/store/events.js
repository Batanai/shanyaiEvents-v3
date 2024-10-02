import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import axios from "axios";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null
  },
  reducers: {
    eventsRequested: (events, action) => {
      events.loading = true;
    },

    eventsReceived: (events, action) => {
      events.list = action.payload;
      events.loading = false;
      events.lastFetch = Date.now();
    },

    eventsRequestFailed: (events, action) => {
      events.loading = false;
    },

    eventsAssignedToUser: (events, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex(bug => bug.id === bugId);
      events.list[index].userId = userId;
    },

    // command - event
    // addBug - bugAdded
    eventsCalled: (events, action) => {
      if (events.list.length > 0) events.list = [];
      
      events.list.push(action.payload);
    },

    // resolveBug (command) - bugResolved (event)
    eventResolved: (events, action) => {
      const index = events.list.findIndex(event => event.id === action.payload.id);
      events.list[index].resolved = true;
    }
  }
});

export const {
  eventsCalled,
  eventResolved,
  eventsAssignedToUser,
  eventsReceived,
  eventsRequested,
  eventsRequestFailed
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/wp-json/meup/v1/event_accepted";

export const loadEvents = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: eventsRequested.type,
      onSuccess: eventsReceived.type,
      onError: eventsRequestFailed.type
    })
  );
};

export const callEvents = event =>
  apiCallBegan({
    url,
    method: "post",
    data: event,
    onSuccess: eventsCalled.type
  });

export const resolveEvent = id =>
  apiCallBegan({
    // /bugs
    // PATCH /bugs/1
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: eventResolved.type
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId },
    onSuccess: eventAssignedToUser.type
  });

// Selector

// Memoization
// bugs => get unresolved bugs from the cache

export const getBugsByUser = userId =>
  createSelector(
    state => state.entities.bugs,
    bugs => bugs.filter(bug => bug.userId === userId)
  );

export const seletEvents = createSelector(
  state => state.entities.events,
  state => state.entities.projects,
  (events, projects) => events.list
);
