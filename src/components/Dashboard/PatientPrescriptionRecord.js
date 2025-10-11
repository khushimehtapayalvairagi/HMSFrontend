import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PatientPrescriptionRecord() {
  const [patientId, setPatientId] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  const fetchPrescriptions = async () => {
    if (!patientId) return toast.error("Enter a patient ID first");

    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/prescriptions/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data.prescriptions || []);
      toast.success("Prescriptions loaded");
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to fetch prescriptions");
      setPrescriptions([]);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Patient Prescription Record</h2>

      <label>
        Patient ID:
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </label>
      <button
        onClick={fetchPrescriptions}
        style={{ margin: "1rem 0", padding: "0.5rem 1rem", background: "#007bff", color: "#fff" }}
      >
        🔍 Load Prescriptions
      </button>

      {prescriptions.length === 0 ? (
        <p>No prescriptions found for this patient.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Doctor</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Consultation Notes</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Medicines</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((v) => (
              <tr key={v._id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(v.createdAt).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {v.assignedDoctorId?.userId?.name || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{v.consultationNotes || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {v.prescription.map((m, i) => (
                    <div key={i}>
                      {m.medicineName} — {m.dosage} ({m.duration})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
