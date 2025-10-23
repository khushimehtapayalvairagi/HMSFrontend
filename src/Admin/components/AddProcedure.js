import React, { useState } from 'react';
import axios from 'axios';

const Procedure = () => {
  const [form, setForm] = useState({ name: '', description: '', cost: '' });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  const [file, setFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ---------- Single Procedure Handlers ----------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        `${BASE_URL}/api/admin/procedures`,
        { name: form.name, description: form.description, cost: Number(form.cost) },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, validateStatus: false }
      );

      if (response.status === 201) {
        setMessage(response.data.message);
        setForm({ name: '', description: '', cost: '' });
        setShowForm(false);
      } else {
        if (response.data.message?.toLowerCase().includes('already exists')) {
          setFieldErrors({ name: response.data.message });
        } else {
          setMessage(response.data.message || 'Failed to create procedure.');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong.');
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setMessage('');
    setFieldErrors({});
  };

  // ---------- Bulk Upload Handlers ----------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBulkMessage('');
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setBulkMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${BASE_URL}/api/admin/procedure/bulk`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      setBulkMessage(res.data.message);
      setFile(null);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Upload failed';
      if (err.response?.data?.errorRows) {
        setBulkMessage(`${errMsg}. Rows with errors: ${err.response.data.errorRows.join(', ')}`);
      } else {
        setBulkMessage(errMsg);
      }
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      
      {/* Single Procedure Form */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Procedure</h2>
      {!showForm ? (
        <>
          {message && <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>{message}</p>}
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button onClick={toggleForm} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              + Add Another
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            {fieldErrors.name && <div style={{ color: 'red', marginTop: '5px' }}>{fieldErrors.name}</div>}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Description:</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows="3" style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Cost:</label>
            <input type="number" name="cost" value={form.cost} onChange={handleChange} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create Procedure</button>
        </form>
      )}

      {/* Bulk Upload Section */}
      <h2 style={{ textAlign: 'center', margin: '30px 0 20px 0' }}>Bulk Upload Procedures</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleBulkUpload} style={{ display: 'block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload</button>
      {bulkMessage && <p style={{ marginTop: '15px', color: bulkMessage.toLowerCase().includes('success') ? 'green' : 'red' }}>{bulkMessage}</p>}
    </div>
  );
};

export default Procedure;
