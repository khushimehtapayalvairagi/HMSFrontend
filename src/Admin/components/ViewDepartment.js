import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewDepartment.css";
import BulkUploadDepartment from "./BulkUploadDepartment";

const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.get(`${BASE_URL}/api/admin/departments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setDepartments(res.data.departments);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setError("Failed to fetch departments.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="view-department-container">
      <div className="view-department-card">
        <h2 className="view-title">Departments</h2>

        {/* ✅ Bulk upload section */}
        <BulkUploadDepartment onUploadSuccess={fetchDepartments} />

        {error && <p className="error-text">{error}</p>}
        {departments.length === 0 ? (
          <p className="no-data">No departments found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="department-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept._id}>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDepartment;
