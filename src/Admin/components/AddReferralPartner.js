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
  const [file, setFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // --- Manual Add Handlers ---
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
      toast.success(res.data.message);
      setForm({ name: '', contactNumber: '' });
      setShowReferralForm(false);
    } catch (err) {
      const backendErrors = err.response?.data?.errors || {};
      const fallback = err.response?.data?.message || 'Something went wrong';
      setErrors(backendErrors);
      if (!Object.keys(backendErrors).length) setMessage(fallback);
      toast.error(fallback);
    }
  };

  const toggleReferralForm = () => {
    setShowReferralForm(prev => !prev);
  };

  // --- Bulk Upload Handlers ---
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBulkMessage('');
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setBulkMessage('Please select a file first.');
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${BASE_URL}/api/admin/referral/bulk`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const { errorRows } = res.data;
      let msg = res.data.message;
      if (errorRows?.length) {
        msg += `. Rows with errors: ${errorRows.join(', ')}`;
      }

      setBulkMessage(msg);
      setFile(null);
      toast.success(msg);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Upload failed';
      setBulkMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Referral Partners Management</h2>

      {/* === Manual Add Section === */}
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
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              + Add Referral Partner
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
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
        </form>
      )}

      {/* === Bulk Upload Section === */}
      <div style={{
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '2px solid #eee'
      }}>
        <h3 style={{ textAlign: 'center' }}>Bulk Upload Referral Partners</h3>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button
          onClick={handleBulkUpload}
          style={{
            display: 'block',
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Upload Excel File
        </button>
        {bulkMessage && <p style={{ marginTop: '15px', color: bulkMessage.toLowerCase().includes('success') ? 'green' : 'red' }}>{bulkMessage}</p>}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddReferralPartner;
