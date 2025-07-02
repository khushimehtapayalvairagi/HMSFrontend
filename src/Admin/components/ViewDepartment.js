import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const res = await axios.get("http://localhost:8000/api/admin/departments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        setDepartments(res.data.departments);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setError("Failed to fetch departments.");
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="view-department-container">
      <div className="view-department-card">
        <h2 className="view-title">Departments</h2>
        {error && <p className="error-text">{error}</p>}
        {departments.length === 0 ? (
          <p className="no-data">No departments found.</p>
        ) : (
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
        )}
      </div>

      {/* Inline CSS */}
      <style>
        {`
          .view-department-container {
            display: flex;
            justify-content: center;
            padding: 40px;
            background-color: #f4f6f8;
            min-height: 100vh;
          }

          .view-department-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 800px;
          }

          .view-title {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }

          .error-text {
            color: red;
            text-align: center;
          }

          .no-data {
            text-align: center;
            font-style: italic;
          }

          .department-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .department-table th,
          .department-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }

          .department-table th {
            background-color: #1976d2;
            color: white;
          }

          .department-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        `}
      </style>
    </div>
  );
};

export default ViewDepartment;
