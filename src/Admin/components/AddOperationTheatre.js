import React, { useState } from "react";
import axios from "axios";

const AddOperationTheatre = () => {
  const [form, setForm] = useState({ name: "", status: "Available" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // 🔹 Handle normal form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/operation-theaters`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage(res.data.message);
      setForm({ name: "", status: "Available" });
      setShowForm(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      if (errorMsg.toLowerCase().includes("exists")) {
        setErrors({ name: errorMsg });
      } else {
        setMessage(errorMsg);
      }
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setErrors({});
    setMessage("");
  };

  // 🔹 Handle bulk upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/operation-theater/bulk`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { errorRows } = res.data;
      let msg = res.data.message;
      if (errorRows?.length) {
        msg += `. Errors at rows: ${errorRows.join(", ")}`;
      }
      setUploadMessage(msg);
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      setUploadMessage(msg);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    }}>
      <h2 style={{ textAlign: "center" }}>Add Operation Theater</h2>

      {/* Add Single OT */}
      {!showForm ? (
        <>
          {message && <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>{message}</p>}
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button onClick={toggleForm} style={{
              padding: "10px 20px",
              backgroundColor: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>+ Add Another</button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Name</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Operation Theater Name"
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Status</label><br />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>Submit</button>
        </form>
      )}

      {/* Divider */}
      <hr style={{ margin: "30px 0" }} />

      {/* Bulk Upload Section */}
      <div>
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Bulk Upload Operation Theaters</h3>
        <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{
          display: "block",
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}>Upload</button>
        {uploadMessage && (
          <p style={{
            marginTop: "15px",
            color: uploadMessage.toLowerCase().includes("success") ? "green" : "red",
          }}>{uploadMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AddOperationTheatre;
