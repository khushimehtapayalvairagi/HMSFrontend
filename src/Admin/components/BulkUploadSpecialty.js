import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulkUploadSpecialty = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post(
        `${BASE_URL}/api/admin/speciality`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(res.data.message || "Bulk upload successful!");
      onUploadSuccess(); // Refresh list in parent
      setFile(null);
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-upload-container">
      <h3 className="bulk-upload-title">Bulk Upload Specialties</h3>
      <div className="bulk-upload-actions">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="bulk-upload-input"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      {/* Toast Container should be included once (maybe in App.js globally) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BulkUploadSpecialty;
