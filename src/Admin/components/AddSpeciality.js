import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSpeciality = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ Fetch specialties
  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE_URL}/api/admin/specialties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpecialties(res.data.specialties);
    } catch (err) {
      toast.error("Failed to load specialties ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // ✅ Add single specialty
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/specialties`,
        { name, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );
      toast.success(res.data.message || "Specialty created ✅");
      setName("");
      setDescription("");
      setErrors({});
      fetchSpecialties(); // refresh list
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      if (msg.includes("exists")) setErrors({ name: msg });
    }
  };

  // ✅ Bulk upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(`${BASE_URL}/api/admin/speciality`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Bulk upload successful ✅");
      setFile(null);
      fetchSpecialties();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed ❌");
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
        Manage Specialties
      </h2>

      {/* Add Specialty Form */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Add Specialty</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            placeholder="Specialty Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.name}</span>}

          <textarea
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
          />
          {errors.description && <span style={{ color: "red", fontSize: "0.9rem" }}>{errors.description}</span>}

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

      {/* Bulk Upload */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Bulk Upload Specialties</h3>
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

      {/* Specialties List */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
        <h3>Specialty List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : specialties.length === 0 ? (
          <p>No specialties found.</p>
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
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map((spec, i) => (
                <tr key={spec._id}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{spec.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{spec.description}</td>
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

export default AddSpeciality;
