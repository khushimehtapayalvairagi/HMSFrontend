import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPatient, setFilteredPatient] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("http://localhost:8000/api/receptionist/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data.patients);
      } catch (err) {
        console.error(err);
       toast.error("Failed to fetch patients");

      }
    };

    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) return alert("Enter patient ID to search");

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`http://localhost:8000/api/receptionist/patients/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredPatient(res.data.patient);
    } catch (err) {
      setFilteredPatient(null);
     toast.error(err.response?.data?.message || "Patient not found.");

    }
  };



  return (
    <div>
      <h2>Patient Records</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

      </div>

      <br />
   
      <div ref={printRef} style={{ marginTop: 20 }}>
        {filteredPatient ? (
          <div style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}>
            <h4>Patient ID: {filteredPatient.patientId}</h4>
            <p>Name: {filteredPatient.fullName}</p>
            <p>DOB: {new Date(filteredPatient.dob).toLocaleDateString()}</p>
            <p>Gender: {filteredPatient.gender}</p>
            <p>Contact: {filteredPatient.contactNumber}</p>
            <p>Email: {filteredPatient.email}</p>
            <p>Address: {filteredPatient.address}</p>
            <p>Status: {filteredPatient.status}</p>
            <h5>Relatives:</h5>
            <ul>
              {filteredPatient.relatives.map((r, i) => (
                <li key={i}>{r.name} ({r.relationship}) - {r.contactNumber}</li>
              ))}
            </ul>
          </div>
        ) : (
  patients.slice().reverse().map((p) => (
  <div key={p.patientId} style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}>
    <h4>Patient ID: {p.patientId}</h4>
    <p>Name: {p.fullName}</p>
    <p>DOB: {new Date(p.dob).toLocaleDateString()}</p>
    <p>Gender: {p.gender}</p>
    <p>Contact: {p.contactNumber}</p>
    <p>Email: {p.email}</p>
    <p>Address: {p.address}</p>
    <p>Status: {p.status}</p>
    <h5>Relatives:</h5>
    <ul>
      {p.relatives.map((r, i) => (
        <li key={i}>{r.name} ({r.relationship}) - {r.contactNumber}</li>
      ))}
    </ul>
  </div>
))


        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default ViewPatient;
