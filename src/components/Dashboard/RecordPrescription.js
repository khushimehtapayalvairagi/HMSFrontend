import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecordPrescription = () => {
  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [visitData, setVisitData] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [prescription, setPrescription] = useState([
    { medicineName: "", dosage: "", frequency: "", duration: "", remarks: "" },
  ]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");

  // Fetch patient and latest visit
  const fetchPatientAndVisit = async () => {
    if (!patientId) return;

    try {
      // 1️⃣ Fetch patient details
      const patientRes = await axios.get(
        `${BASE_URL}/api/receptionist/patients/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const patient = patientRes.data.patient; // <-- single object
      if (!patient) {
        toast.error("Patient not found");
        setPatientDetails(null);
        setVisitData(null);
        return;
      }

      setPatientDetails(patient);

      // 2️⃣ Fetch latest visit for this patient
      const visitRes = await axios.get(
         `${BASE_URL}/api/receptionist/visits/${patient.patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const visits = visitRes.data.visits || [];
      if (visits.length === 0) {
        toast.info("No visit found for this patient");
        setVisitData(null);
        return;
      }

      const latestVisit = visits[0];
      setVisitData(latestVisit);
      setConsultationNotes(latestVisit.consultationNotes || "");
      setPrescription(
        latestVisit.prescription?.length
          ? latestVisit.prescription
          : [
              { medicineName: "", dosage: "", frequency: "", duration: "", remarks: "" },
            ]
      );
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      toast.error("Failed to fetch patient or visit data");
      setPatientDetails(null);
      setVisitData(null);
    }
  };

  // Update medicine field
  const updateMed = (index, field, value) => {
    const newPres = [...prescription];
    newPres[index][field] = value;
    setPrescription(newPres);
  };

  const addMedicineRow = () =>
    setPrescription([
      ...prescription,
      { medicineName: "", dosage: "", frequency: "", duration: "", remarks: "" },
    ]);

  const removeMed = (i) =>
    setPrescription(prescription.filter((_, idx) => idx !== i));

  // Save prescription
  const handleSavePrescription = async () => {
    if (!visitData) return toast.error("No visit selected");

    try {
      const res = await axios.put(
        `${BASE_URL}/api/receptionist/visits/${visitData._id}/prescription`,
        { consultationNotes, prescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Prescription saved successfully!");
      setVisitData(res.data.visit);
    } catch (err) {
      console.error("Prescription save error:", err.response?.data || err);
      toast.error("Error saving prescription");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Record Doctor Prescription
      </h2>

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
        onClick={fetchPatientAndVisit}
        style={{ margin: "0.5rem 0", padding: "0.5rem 1rem" }}
      >
        Load Patient & Latest Visit
      </button>

      {patientDetails && (
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: 6,
            background: "#fff",
            marginTop: "1rem",
          }}
        >
          <p>
            <strong>Name:</strong> {patientDetails.fullName}
          </p>
          <p>
            <strong>Age/Gender:</strong> {patientDetails.age} / {patientDetails.gender}
          </p>
          <p>
            <strong>Contact:</strong> {patientDetails.contactNumber || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {patientDetails.address || "N/A"}
          </p>
        </div>
      )}

      {visitData && (
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: 6,
            background: "#f9f9f9",
            marginTop: "1rem",
          }}
        >
          <p>
            <strong>Visit Type:</strong> {visitData.visitType}
          </p>
         <p>
  <strong>Doctor:</strong>{" "}
  {visitData.assignedDoctorId?.userId?.name || "N/A"}
</p>

          <p>
            <strong>Visit Date:</strong>{" "}
            {new Date(visitData.visitDate || visitData.createdAt).toLocaleString()}
          </p>
        </div>
      )}

      {visitData && (
        <>
          <h3>Consultation Notes</h3>
          <textarea
            value={consultationNotes}
            onChange={(e) => setConsultationNotes(e.target.value)}
            rows="4"
            style={{ width: "100%", padding: "0.5rem" }}
          />

          <h4>Medicines</h4>
          {prescription.map((med, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "5px", marginBottom: "8px" }}
            >
              <input
                type="text"
                placeholder="Medicine Name"
                value={med.medicineName}
                onChange={(e) => updateMed(index, "medicineName", e.target.value)}
                style={{ flex: 2, padding: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Dosage"
                value={med.dosage}
                onChange={(e) => updateMed(index, "dosage", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => updateMed(index, "frequency", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => updateMed(index, "duration", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              />
              <button type="button" onClick={() => removeMed(index)}>
                ❌
              </button>
            </div>
          ))}
          <button type="button" onClick={addMedicineRow}>
            + Add Medicine
          </button>

          <br />
          <button
            type="button"
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#007bff",
              color: "#fff",
            }}
            onClick={handleSavePrescription}
          >
            💊 Save Prescription
          </button>
        </>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default RecordPrescription;
