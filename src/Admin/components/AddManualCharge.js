import React, { useState } from 'react';
import axios from 'axios';

const AddManualCharge = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // --- Single Item State ---
  const [form, setForm] = useState({ itemName: '', category: '', defaultPrice: '', description: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

  // --- Bulk Upload State ---
  const [file, setFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');

  // -------- Single Item Handlers --------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${BASE_URL}/api/admin/manual-charge-items`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      setMessage(res.data.message);
      setForm({ itemName: '', category: '', defaultPrice: '', description: '' });
      setShowForm(false);
    } catch (err) {
      const fallback = err.response?.data?.message || 'Something went wrong';
      if (fallback.toLowerCase().includes('exist')) setErrors({ itemName: fallback });
      else setMessage(fallback);
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setMessage('');
    setErrors({});
  };

  // -------- Bulk Upload Handlers --------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBulkMessage('');
  };

  const handleBulkUpload = async () => {
    if (!file) { setBulkMessage('Please select a file first.'); return; }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${BASE_URL}/api/admin/manual-charge-item/bulk`, formData, {
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

  // -------- Template Download --------
  // const downloadTemplate = () => {
  //   const template = [
  //     ['itemName', 'category', 'defaultPrice', 'description'],
  //     ['X-ray', 'Lab', 500, 'Digital chest X-ray'],
  //     ['Admission Fee', 'Other', 1000, 'IPD Admission Fee']
  //   ];

  //   let csvContent = "data:text/csv;charset=utf-8," 
  //     + template.map(e => e.join(",")).join("\n");

  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "manual_charge_template.csv");
  //   document.body.appendChild(link);
  //   link.click();
  // };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      
      {/* Single Manual Charge Form */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Manual Charge Item</h2>
      {!showForm ? (
        <>
          {message && <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>{message}</p>}
          <button onClick={toggleForm} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>+ Add Another</button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" name="itemName" placeholder="Item Name" value={form.itemName} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          {errors.itemName && <div style={{ color: 'red' }}>{errors.itemName}</div>}

       <input
  type="text"
  name="category"
  placeholder="Category (e.g. XRAY, Lab, OT, Scan)"
  value={form.category}
  onChange={handleChange}
  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
/>

          {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}

          <input type="number" name="defaultPrice" placeholder="Default Price" value={form.defaultPrice} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          {errors.defaultPrice && <div style={{ color: 'red' }}>{errors.defaultPrice}</div>}

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}

          <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: '#fff', width: '100%', border: 'none', borderRadius: '5px' }}>Submit</button>
        </form>
      )}

      {/* Bulk Upload Section */}
      <h2 style={{ textAlign: 'center', margin: '30px 0 20px 0' }}>Bulk Upload Manual Charges</h2>
      <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
      <button onClick={handleBulkUpload} style={{ display: 'block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload</button>
      {bulkMessage && <p style={{ marginTop: '15px', color: bulkMessage.toLowerCase().includes('success') ? 'green' : 'red' }}>{bulkMessage}</p>}
    </div>
  );
};

export default AddManualCharge;
