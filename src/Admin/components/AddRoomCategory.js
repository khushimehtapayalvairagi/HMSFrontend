import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RoomCategory = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [formVisible, setFormVisible] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/room-categories`, form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      toast.success(res.data.message || "Room category created successfully!");
      setForm({ name: "", description: "" });
      setFormVisible(false);
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
      const res = await axios.post(`${BASE_URL}/api/admin/room-category`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      toast.success(`${res.data.count} Room Categories uploaded successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk upload failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>
      <h2>Create Room Category</h2>

      {formVisible ? (
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: "100%", padding: "8px", marginBottom: "10px" }} />
          <button type="submit" style={{ padding: "10px 20px" }}>Create</button>
        </form>
      ) : (
        <button onClick={() => setFormVisible(true)} style={{ padding: "10px 20px", marginTop: "10px" }}>Create Another</button>
      )}

      <div style={{ marginTop: "30px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
        <h3>📤 Bulk Upload Room Categories</h3>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkUpload} />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RoomCategory;
