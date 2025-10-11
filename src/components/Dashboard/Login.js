// Login.jsx
import React, { useState, useEffect } from 'react';
import './Login.css';

import { useNavigate } from 'react-router-dom';

import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
const BASE_URL = process.env.REACT_APP_BASE_URL;

  // useEffect(() => {
  //   if (jwt && user) {
  //     if (user.role === "ADMIN") navigate("/admin-dashboard");
  //     else if (user.designation === "Receptionist") navigate("/receptionist-dashboard");
  //     else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
  //     else if (user.designation === "Head Nurse") navigate("/nurse-dashboard");
  //     else if (user.designation === "Inventory Manager") navigate("/inventoryManager-dashboard");
  //     else toast.error("Unknown role, cannot navigate", { position: "top-center", autoClose: 4000 });
  //   }
  // }, [jwt, user, navigate]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    // Save token and user in localStorage
    localStorage.setItem("jwt", token);
    console.log("Token saved:", localStorage.getItem("jwt"));

    localStorage.setItem("user", JSON.stringify(user));

    // Navigate based on role/designation
    if (user.role === "ADMIN") navigate("/admin-dashboard");
    else if (user.designation === "Receptionist") navigate("/receptionist-dashboard");
    // else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
    else if (user.designation === "Head Nurse") navigate("/nurse-dashboard");
    else if (user.designation === "Inventory Manager") navigate("/inventoryManager-dashboard");
      else if (user.designation === "Lab Technician") navigate("/labTechnician-dashboard");
    else toast.error("Unknown role, cannot navigate", { position: "top-center", autoClose: 4000 });

  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Invalid email or password");
    navigate("/somewhere");
  }
};


  return (
    <div className="hospital-login-container">
      <ToastContainer />
  <div className="hospital-left">
  <div className="logo-container">
    <img src="/images/logo2.png" alt="Care Cure Logo" className="hospital-logo" />
    <span className="logo-text">CareCure Hospital</span> {/* ⬅️ Hospital name */}
  </div>

  {/* 🔁 Restore this blur overlay */}
  <div className="overlay-text"></div>

  <div className="left-heading">
    <h1>Centers of</h1>
    <h3 className="excellence-text">
      E<span className="black-x">x</span>cellence
    </h3>
    <p>
      Empowering Healthcare, Saving Lives.
      Your Health, Our Mission.
      Dedicated to Patient-Centered Excellence.
    </p>
  </div>
</div>



      <div className="hospital-right">
        <form onSubmit={handleSubmit}>
          <div className="welcome-section">
            <FaLock className="lock-icon" />
            <h2>Welcome</h2>
          </div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
         
          <button className='button' type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
