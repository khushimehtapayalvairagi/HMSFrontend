// src/pages/lab/PatientList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PatientsPage() {
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("No token found, please login again");
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/lab/tests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTests(res.data.tests || []);
      } catch (err) {
        console.error("Error fetching tests:", err);
      }
    };

    fetchTests();
  }, [BASE_URL]);

  const filtered = tests.filter((t) => {
    const matchesSearch = t.patientId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h2>Patient List</h2>

      {/* Filters */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Search by patient name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Adress</th>
            <th>Gender</th>
            <th>Test Type</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((test) => (
              <tr key={test._id}>
                <td>{test.patientId?.fullName}</td>
                <td>{test.patientId?.age}</td>
                <td>{test.patientId?.address}</td>
                <td>{test.patientId?.gender}</td>
                <td>{test.testType}</td>
                <td>{test.status}</td>
                <td>
  {Array.isArray(test.results)
    ? test.results.join(", ")
    : test.result || "-"}
</td>


              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

