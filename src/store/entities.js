import { combineReducers } from "redux";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import usersReducer from "./users";
import eventsReducer from './events';
import ticketsReducer from "./tickets";

export default combineReducers({
  bugs: bugsReducer,
  projects: projectsReducer,
  users: usersReducer,
  events: eventsReducer,
  tickets: ticketsReducer
});
