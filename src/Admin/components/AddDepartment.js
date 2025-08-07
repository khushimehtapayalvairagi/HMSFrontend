import React, { useState } from 'react';
import axios from 'axios';
import './AddDepartment.css'; // 👈 import the CSS
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddDepartment = () => {
  const [form, setForm] = useState({
    name: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
const BASE_URL = process.env.REACT_APP_BASE_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
`${BASE_URL}/api/admin/departments`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setMessage(res.data.message);
      setForm({ name: '', description: '' });
       setFormVisible(false); // Clear form
    } catch (error) {
      console.error("Department creation failed:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };
    const toggleForm = () => {
    setFormVisible(true);
    setMessage('');
  };

 return (
    <div className="department-container">
      <div className="department-card">
        <h2 className="department-title">Add Department</h2>

        {!formVisible ? (
          <>
            <p className="message-text success">{message}</p>
            <button onClick={toggleForm} className="submit-btn">
              + Add Another Department
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="department-form">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input-field"
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="textarea-field"
            />
            <button type="submit" className="submit-btn">Create Department</button>
          </form>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddDepartment;
