import axios from "axios"
import { API_BASE_URL } from "../config/ApiConfig"
import {  LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE } from "./ActionType"

const token = localStorage.getItem("jwt")
const registerRequest =()=>({type:REGISTER_REQUEST});
const registerSuccess =(message)=>({type:REGISTER_SUCCESS,payload:message});
const registerFailure =(error)=>({type:REGISTER_FAILURE,payload:error});

export const CREATE_SPECIALITY_REQUEST = 'CREATE_SPECIALITY_REQUEST';
export const CREATE_SPECIALITY_SUCCESS = 'CREATE_SPECIALITY_SUCCESS';
export const CREATE_SPECIALITY_FAILURE = 'CREATE_SPECIALITY_FAILURE';



export const fetchDoctors = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });

  try {
     const token = localStorage.getItem("jwt");
    const res = await axios.get('http://localhost:8000/api/admin/doctors', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    dispatch({
      type: FETCH_USERS_SUCCESS,
         payload: res.data.doctors, 
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const fetchStaff = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });

  try {
       const token = localStorage.getItem("jwt");
    const res = await axios.get('http://localhost:8000/api/admin/staff', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    dispatch({
      type: FETCH_USERS_SUCCESS,
     payload: res.data.staff,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};




export const register = (userData)=>async(dispatch)=>{
 dispatch(registerRequest())

    try {
    const response = await axios.post(`${API_BASE_URL}/admin/users`, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
    
    
       dispatch(registerSuccess(response.data.message));
    return { success: true, message: response.data.message };


} catch (error) {
    console.error("Add User Error:", error.response?.data || error.message);
    const errMsg = error.response?.data?.message || 'User creation failed';
    dispatch(registerFailure(errMsg));
    return { success: false, message: errMsg };
  }
};


const loginRequest =()=>({type:LOGIN_REQUEST});
const loginSuccess =(user)=>({type:LOGIN_SUCCESS,payload:user});
const loginFailure =(error)=>({type:LOGIN_FAILURE,payload:error});

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
    const { token, user: u } = response.data;

    if (token) {
      localStorage.setItem("jwt", token);
      localStorage.setItem("role", u.role);
       localStorage.setItem("user", JSON.stringify(u));
    }

    dispatch(loginSuccess({ jwt: token, user: u }));
    return response; // ✅ good practice
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
     localStorage.removeItem("jwt");
    localStorage.removeItem("role");
     localStorage.removeItem("user");

    
    throw error; // ✅ important to let caller handle it
  }
};

// export const logout =()=>(dispatch)=>{
//   dispatch({type:LOGOUT,payload:null})
//   localStorage.clear();
// }