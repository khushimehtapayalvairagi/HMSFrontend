// src/State/Auth/Reducer.js

import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE
} from "./ActionType";

const initialAuthState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: null,
};

export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };

      case REGISTER_SUCCESS:
    return { ...state, isLoading: false, error: null, message: action.payload };

    case LOGIN_SUCCESS:
  return {
    ...state,
    isLoading: false,
    error: null,
    jwt: action.payload.jwt,
    user: action.payload.user,
  };


    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    default:
      return state;
  }
};

const initialUsersState = {
  loading: false,
  users: [],
  error: null,
};

export const usersReducer = (state = initialUsersState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_SUCCESS:
      return { loading: false, users: action.payload, error: null };
    case FETCH_USERS_FAILURE:
      return { loading: false, users: [], error: action.payload };
    default:
      return state;
  }
};
