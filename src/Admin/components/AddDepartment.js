import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDepartment = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE_URL}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data.departments);
    } catch (err) {
      toast.error("Failed to load departments ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  // ✅ Add Department
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/departments`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Department created ✅");
      setForm({ name: "", description: "" });
      fetchDepartments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    }
  };

  // ✅ Bulk Upload
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first ❌");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/department`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message || "Bulk upload successful ✅");
      setFile(null);
      fetchDepartments();
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errorRows) {
        toast.error(`Validation failed at rows: ${errData.errorRows.join(", ")}`);
      } else if (errData?.duplicateRows) {
        toast.error(`Already exists at rows: ${errData.duplicateRows.join(", ")}`);
      } else {
        toast.error(errData?.message || "Upload failed ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Manage Departments
      </h2>

      {/* ➕ Add Department */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Add Department</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Department Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.name}
            </span>
          )}
          <textarea
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.description}
            </span>
          )}
          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>
      </div>

      {/* 📂 Bulk Upload */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Bulk Upload Departments</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: "10px",
              background: uploading ? "#aaa" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* 📋 Departments List */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
        <h3>Department List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : departments.length === 0 ? (
          <p>No departments found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>#</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, i) => (
                <tr key={dept._id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {i + 1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {dept.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {dept.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddDepartment;
