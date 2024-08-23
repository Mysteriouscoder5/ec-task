import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import userReducer from "./redux/reducers/userReducer.js";
import connectionReducer from "./redux/reducers/connectionReducer.js";

const middleware = [
  createLogger({
    duration: true,
    timestamp: false,
    collapsed: true,
    colors: {
      title: () => "#139BFE",
      prevState: () => "#1C5FAF",
      action: () => "#149945",
      nextState: () => "#A47104",
      error: () => "#ff0005",
    },
    predicate: () => typeof window !== "undefined",
  }),
];

const reducer = combineReducers({
  user: userReducer,
  connection: connectionReducer,
});

const preloadedState = {};

const store = configureStore({
  reducer,
  preloadedState,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export default store;
