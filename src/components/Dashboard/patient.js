import React, { useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PatientForm.css";

const PatientForm = () => {
  const printRef = useRef();
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    gender: "",
     dob: "",
    contactNumber: "",
    email: "",
    address: "",
    aadhaarNumber: "",
    relatives: [{ name: "", contactNumber: "", relationship: "" }]
  });
  const [submittedData, setSubmittedData] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const validateContact = (val) => /^\d*$/.test(val) && val.length <= 10;
  const validateAadhaar = (val) => /^\d{0,12}$/.test(val);
const validateAbha = (val) => /^\d{0,14}$/.test(val);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactNumber" && value && !validateContact(value)) {
      return toast.error("Contact number must be numeric and max 10 digits");
    }

    if (name === "aadhaarNumber" && value && !validateAadhaar(value)) {
      return toast.error("Aadhaar must be numeric and max 12 digits");
    }
      if (name === "abhaNumber" && value && !validateAbha(value)) {
  return toast.error("ABHA must be numeric and max 14 digits");
}


    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRelChange = (i, e) => {
    const { name, value } = e.target;
    const newR = [...form.relatives];
    newR[i][name] = value;
    setForm((p) => ({ ...p, relatives: newR }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (!form.fullName || !form.age || !form.gender || !form.address) {
      return toast.error("Name, Age, Gender, and Address are compulsory");
    }

    // Patient contact validation if filled
    if (form.contactNumber && form.contactNumber.length !== 10) {
      return toast.error("Contact number must be exactly 10 digits");
    }

    // Aadhaar validation if filled
    if (form.aadhaarNumber && form.aadhaarNumber.length !== 12) {
      return toast.error("Aadhaar number must be exactly 12 digits");
    }
  

    const token = localStorage.getItem("jwt");
    if (!token) return toast.error("Please log in first");

const payload = {
  ...form,
   abhaNumber: form.abhaNumber?.trim() || undefined, 
  aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
  relatives: form.relatives?.filter(r => r.name || r.contactNumber || r.relationship) || []
};

    try {
      const res = await axios.post(`${BASE_URL}/api/receptionist/patients`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        setSubmittedData(res.data.patient);
        toast.success("Patient registered successfully!");
      } else {
        toast.error("Unexpected server response");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const w = window.open("", "", "width=800,height=600");
    w.document.write(`
      <html>
        <head><title>Patient Details</title></head>
        <body>${content}</body>
      </html>
    `);
    w.document.close();
    w.print();
  };

  const cardStyle = {
    backgroundColor: "green",
    borderRadius: "8px",
    padding: "2rem",
    maxWidth: "800px",
    margin: "2rem auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Segoe UI, sans-serif",
  };
  const twoCol = { display: "flex", gap: "1rem", marginBottom: "1rem" };
  const relRow = { display: "flex", gap: "0.5rem", marginBottom: "0.8rem", alignItems: "center" };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: "1.5rem" }}>👩‍⚕️ Register Patient</h2>
      <form onSubmit={handleSubmit}>
        <div style={twoCol}>
          <input
            name="fullName"
            placeholder="👤 Full Name *"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            type="number"
            name="age"
            placeholder="🎂 Age *"
            value={form.age}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
            min="0"
          />
        </div>

        <div style={twoCol}>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          >
            <option value="">⚥ Gender *</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
            <input
            name="address"
            placeholder="🏠 Address *"
            value={form.address}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          {/* <input
            name="contactNumber"
            placeholder="📞 Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            maxLength={10}
            style={{ flex: 1 }}
          /> */}
        </div>

    <div style={twoCol}>
          <input
            name="aadhaarNumber"
            placeholder="🆔 Aadhaar Number"
            value={form.aadhaarNumber}
            onChange={handleChange}
            maxLength={12}
            
            // style={{ width: "100%" }}
          />
        <div className="date-input-wrapper">
  <input
    type="date"
    name="dob"
    value={form.dob}
    onChange={handleChange}
  style={{ flex: 1 }}

  />
</div>

        </div>

        <div style={twoCol}>
          <input
            name="email"
            type="email"
            placeholder="✉️ Email"
            value={form.email}
            onChange={handleChange}
            style={{ flex: 1 }}
          />
       <input
  name="abhaNumber"
  placeholder="🏥 ABHA Number (Optional)"
  value={form.abhaNumber}
  onChange={handleChange}
  maxLength={14}
  style={{ flex: 1 }}
/>

            <input
            name="contactNumber"
            placeholder="📞 Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            maxLength={10}
            style={{ flex: 1 }}
          />
        </div>

        {/* Relatives section remains unchanged */}
        <h4 style={{ margin: "1rem 0 0.5rem" }}>👥 Relatives</h4>
        {form.relatives.map((rel, i) => (
          <div key={i} style={relRow}>
            <input
              name="name"
              placeholder="👥 Relative Name"
              value={rel.name}
              onChange={(e) => handleRelChange(i, e)}
              style={{ flex: 1 }}
            />
            <input
              name="contactNumber"
              placeholder="📞 Relative Contact"
              value={rel.contactNumber}
              onChange={(e) => handleRelChange(i, e)}
              style={{ flex: 1 }}
              maxLength={10}
            />
            <input
              name="relationship"
              placeholder="🔗 Relationship"
              value={rel.relationship}
              onChange={(e) => handleRelChange(i, e)}
              style={{ flex: 1 }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Register Patient
        </button>
      </form>

      {submittedData && (
        <div style={{ marginTop: "2rem" }}>
          <button onClick={handlePrint}>🖨️ Print Patient Details</button>
          <div ref={printRef} style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <h2>Patient Registration Details</h2>
            <p><strong>Patient ID:</strong> {submittedData.patientId}</p>
            <p><strong>Name:</strong> {submittedData.fullName}</p>
            <p><strong>Age:</strong> {submittedData.age}</p>
            <p><strong>Date of Birth:</strong> {submittedData.dob ? new Date(submittedData.dob).toLocaleDateString() : "N/A"}</p>
                <p><strong>ABHA:</strong> {submittedData.abhaNumber || "N/A"}</p>

            <p><strong>Gender:</strong> {submittedData.gender}</p>
            <p><strong>Contact:</strong> {submittedData.contactNumber}</p>
            <p><strong>Aadhaar:</strong> {submittedData.aadhaarNumber}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Address:</strong> {submittedData.address}</p>

            <h4>Relatives:</h4>
            <ul>
              {submittedData.relatives.map((r, idx) => (
                <li key={idx}>{r.name} – {r.relationship} – {r.contactNumber}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PatientForm;
