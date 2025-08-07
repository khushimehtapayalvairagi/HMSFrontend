// AddReferralPartner.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddReferralPartner = () => {
  const [form, setForm] = useState({ name: '', contactNumber: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
const [showReferralForm, setShowReferralForm] = useState(false);
const BASE_URL = process.env.REACT_APP_BASE_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setMessage('');
   const newErrors = {};
  if (!form.contactNumber.match(/^\d{10}$/)) {
    newErrors.contactNumber = 'Contact number must be exactly 10 digits.';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    toast.error('Please correct the errors before submitting.');
    return;
  }

  try {
    const token = localStorage.getItem('jwt');
    const res = await axios.post(`${BASE_URL}/api/admin/referral-partners`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    setMessage(res.data.message);
    setForm({ name: '', contactNumber: '' });
    setShowReferralForm(false); // 👈 Hide the form after successful submit
  } catch (err) {
    const backendErrors = err.response?.data?.errors || {};
    const fallback = err.response?.data?.message || 'Something went wrong';
    setErrors(backendErrors);
    if (!Object.keys(backendErrors).length) setMessage(fallback);
  }
};

  const toggleReferralForm = () => {
  setShowReferralForm(prev => !prev);
};


  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Add Referral Partner</h2>
             {!showReferralForm ? (
        <>
          {message && (
            <p style={{
              textAlign: 'center',
              color: message.toLowerCase().includes('success') ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {message}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button onClick={toggleReferralForm} style={{
              padding: '10px 20px', backgroundColor: '#3498db',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}>
              + Add Another
            </button>
          </div>
        </>
      ) :(   
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name</label><br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Referral Partner Name"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Number</label><br />
          <input
            type="text"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {errors.contactNumber && <div style={{ color: 'red' }}>{errors.contactNumber}</div>}
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Submit</button>

        {message && <p style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>{message}</p>}
      </form>
      )}
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default AddReferralPartner;
