// src/pages/lab/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LabDashboard() {
  const [stats, setStats] = useState({ pending: 0, completed: 0 });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("No token found, please login again.");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/lab/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data || { pending: 0, completed: 0 });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchStats();
  }, [BASE_URL]);

  return (
    <div>
      <h2>Lab Technician Dashboard</h2>
      <div className="stats" style={{ display: "flex", gap: "1rem" }}>
        <div className="box">Pending Results: {stats.pending}</div>
        <div className="box">Completed Results: {stats.completed}</div>
      </div>
    </div>
  );
}
