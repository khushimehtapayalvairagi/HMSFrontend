import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";

const BulkUploadDepartment = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
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

      alert(res.data.message || "Bulk upload successful!");
      onUploadSuccess(); // refresh list in parent
      setFile(null);
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert(error.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bulk-upload-container">
      <h3 className="bulk-upload-title">Bulk Upload Departments</h3>
      <div className="bulk-upload-actions">
        <input
          type="file"
          accept=".csv"
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
    </div>
  );
};

export default BulkUploadDepartment;
