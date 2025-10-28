import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLabour = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/labour-rooms`, form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      toast.success(res.data.message || "Labour Room created successfully!");
      setForm({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/labour-rooms/bulk`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      toast.success(`${res.data.count} Labour Rooms uploaded successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk upload failed");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#f9f9f9', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Add Labour Room</h2>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '10px' }} />
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px' }} />
          <button type="submit" style={{ marginTop: '10px', background: '#3498db', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', width: '100%' }}>Create</button>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} style={{ marginTop: '10px', background: '#2ecc71', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', width: '100%' }}>+ Add Another</button>
      )}

      <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>📤 Bulk Upload Labour Rooms (Excel/CSV)</h3>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkUpload} style={{ marginTop: '10px' }} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AddLabour;
