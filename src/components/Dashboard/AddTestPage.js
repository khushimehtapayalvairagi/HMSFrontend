import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

export default function AddTestPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    testType: "",
    results: [""], // ✅ multiple results
    date: "",
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return toast.error("No token found, please login again.");

        const res = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  // ✅ Add new result field
  const addResultField = () => {
    setForm({ ...form, results: [...form.results, ""] });
  };

  // ✅ Handle result value change
  const handleResultChange = (index, value) => {
    const newResults = [...form.results];
    newResults[index] = value;
    setForm({ ...form, results: newResults });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return toast.error("No token found, please login again.");

      await axios.post(`${BASE_URL}/api/lab/tests`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Test results saved successfully!");
      setForm({ patientId: "", testType: "", results: [""], date: "" });
    } catch (err) {
      console.error("Error saving test result:", err);
      toast.error("❌ Failed to save test result");
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: `${p.fullName}`,
  }));

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Add Test Result</h2>
      <form onSubmit={handleSubmit}>
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
          style={{ display: "block", marginTop: "10px", width: "100%" }}
        />

        {/* ✅ Multiple Result Fields */}
        <label style={{ display: "block", marginTop: "10px" }}>
          Enter Results:
        </label>
        {form.results.map((res, index) => (
          <input
            key={index}
            placeholder={`Result ${index + 1}`}
            value={res}
            onChange={(e) => handleResultChange(index, e.target.value)}
            style={{
              width: "100%",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        ))}
        <button
          type="button"
          onClick={addResultField}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 10px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          + Add More Result
        </button>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          style={{ display: "block", marginTop: "10px", width: "100%" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
