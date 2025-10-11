// src/pages/lab/AddTestResult.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";  
export default function AddTestPage() {
    const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    testType: "",
    result: "",
    date: "",
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

 useEffect(() => {
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
           toast.error("No token found, please login again.");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ filter out discharged patients
      const activePatients = (res.data.patients || []).filter(
        (p) => p.status !== "Discharged"
      );

      setPatients(activePatients);
    } catch (err) {
      console.error("Error fetching patients:", err);
    toast.error("Failed to fetch patients");

    }
  };

  fetchPatients();
}, [BASE_URL]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
         toast.error("No token found, please login again.");
        return;
      }

      await axios.post(`${BASE_URL}/api/lab/tests`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        toast.success("✅ Test result saved successfully!");
      setForm({ patientId: "", testType: "", result: "", date: "" });
    } catch (err) {
      console.error("Error saving test result:", err);
      toast.error("❌ Failed to save test result");
    }
  };
    const patientOptions = patients.map((p) => ({
    value: p._id,
     label: `${p.fullName}`,
    // label: `${p.fullName} (${p.gender || "N/A"}) - ${p.address || "No Address"}`,
  }));

  return (
    <div>
      <h2>Add Test Result</h2>
      <form onSubmit={handleSubmit}>
                {/* <input
          type="text"
          placeholder="Search by patient name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "10px", display: "block", width: "100%" }}
        /> */}

       <Select
          options={patientOptions}
          placeholder="Search & select patient"
          value={patientOptions.find((opt) => opt.value === form.patientId) || null}
          onChange={(selected) =>
            setForm({ ...form, patientId: selected ? selected.value : "" })
          }
          isClearable
        />

        <input
          placeholder="Test Type"
          value={form.testType}
          onChange={(e) => setForm({ ...form, testType: e.target.value })}
        />

        <input
          placeholder="Result"
          value={form.result}
          onChange={(e) => setForm({ ...form, result: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button type="submit">Submit</button>
      </form>
 <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
