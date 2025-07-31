import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewPatient.css"; // custom CSS

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPatient, setFilteredPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          "http://localhost:8000/api/receptionist/patients",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPatients(res.data.patients);
      } catch (err) {
        toast.error("Failed to fetch patients");
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) return toast.warn("Enter patient ID to search");
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(
        `http://localhost:8000/api/receptionist/patients/${searchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFilteredPatient(res.data.patient);
    } catch (err) {
      setFilteredPatient(null);
      toast.error(err.response?.data?.message || "Patient not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-patient-container">
      <h2>Patient Records</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div ref={printRef} className="patient-list">
        {loading ? (
          <p className="loading">Searching...</p>
        ) : filteredPatient ? (
          <PatientCard patient={filteredPatient} />
        ) : (
          [...patients].reverse().map((p) => <PatientCard key={p.patientId} patient={p} />)
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

const PatientCard = ({ patient }) => (
  <div className="patient-card">
    <h4>Patient ID: {patient.patientId}</h4>
    <p><strong>Name:</strong> {patient.fullName}</p>
    <p><strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
    <p><strong>Gender:</strong> {patient.gender}</p>
    <p><strong>Contact:</strong> {patient.contactNumber}</p>
    <p><strong>Email:</strong> {patient.email}</p>
    <p><strong>Address:</strong> {patient.address}</p>
    <p><strong>Status:</strong> {patient.status}</p>

    <h5>Relatives:</h5>
    {patient.relatives?.length > 0 ? (
      <ul>
        {patient.relatives.map((r, i) => (
          <li key={i}>
            {r.name} ({r.relationship}) - {r.contactNumber}
          </li>
        ))}
      </ul>
    ) : (
      <p>No relatives listed.</p>
    )}
  </div>
);

export default ViewPatient;
