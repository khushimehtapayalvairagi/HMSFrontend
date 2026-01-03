





import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import { useAdmissionAdvice } from "../../context/AdmissionAdviceContext";

const socket = io(process.env.REACT_APP_BASE_URL, {
  withCredentials: true,
});

const IPDAdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const { adviceData } = useAdmissionAdvice();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const patient = location.state?.patient || null;
  const visit = location.state?.visit || null;

  const initialPatientId = adviceData?.patientDbId || patient?._id || "";
  const initialVisitId = adviceData?.visitId || visit?._id || "";
  const initialAdmittingDoctorId =
    adviceData?.admittingDoctorId || visit?.assignedDoctorId || "";

  const [patientId, setPatientId] = useState(initialPatientId);
  const [visitId, setVisitId] = useState(initialVisitId);
  const [admittingDoctorId, setAdmittingDoctorId] = useState(
    initialAdmittingDoctorId
  );

  const [patientName, setPatientName] = useState(
    adviceData?.patientName || patient?.name || visit?.patientName || ""
  );
  const [doctorName, setDoctorName] = useState(visit?.doctorName || "");

  const [submitted, setSubmitted] = useState(false);

  const [wards, setWards] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);

  const [wardId, setWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [roomCategoryId, setRoomCategoryId] = useState("");
  const [expectedDischargeDate, setExpectedDischargeDate] = useState("");

  const [admissionData, setAdmissionData] = useState(null);
  const [admittedOn, setAdmittedOn] = useState("");

  const printRef = useRef();

  useEffect(() => {
    fetchWards();
    fetchRoomCategories();

    socket.emit("joinReceptionistRoom");
    socket.on("newIPDAdmissionAdvice", (data) => {
      toast.info(`Doctor advised admission for Patient ID: ${data.patientId}`);
      setPatientId(data.patientId || "");
      setVisitId(data.visitId || "");
      setAdmittingDoctorId(data.admittingDoctorId || data.doctorId || "");
      setPatientName(data.patientName || "");
      setDoctorName(data.doctorName || "");
    });

    return () => {
      socket.off("newIPDAdmissionAdvice");
    };
  }, []);

  useEffect(() => {
    if (adviceData?.doctorName) setDoctorName(adviceData.doctorName);
    if (adviceData?.patientName) setPatientName(adviceData.patientName);
  }, [adviceData]);

  const fetchWards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/wards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWards(res.data.wards || []);
    } catch (err) {
      toast.error("Failed to load wards");
    }
  };

  const fetchRoomCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/receptionist/room-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoomCategories(res.data.roomCategories || []);
    } catch (err) {
      toast.error("Failed to load room categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !patientId ||
      !visitId ||
      !wardId ||
      !bedNumber ||
      !roomCategoryId ||
      !admittingDoctorId
    ) {
      return toast.error("All required fields must be filled.");
    }

    const chosenWard = wards.find((w) => w._id === wardId);
    const numericBedNumber = Number(bedNumber);

    if (
      !chosenWard ||
      !chosenWard.beds.some(
        (b) =>
          Number(b.bedNumber) === numericBedNumber && b.status === "available"
      )
    ) {
      return toast.error("Selected bed is not available");
    }

    const payload = {
      patientId,
      visitId,
      wardId,
      bedNumber: numericBedNumber,
      roomCategoryId,
      admittingDoctorId,
      expectedDischargeDate,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/ipd/admissions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmissionData(res.data.admission || res.data);
      setAdmittedOn(new Date().toLocaleDateString());
      toast.success("IPD Admission successful!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "IPD Admission failed.");
    }
  };

  const getNameParts = (fullName) => {
    if (!fullName) return { surname: "", firstName: "", middleName: "" };
    const parts = fullName.trim().split(" ");
    return {
      surname: parts[parts.length - 1] || "",
      firstName: parts[0] || "",
      middleName: parts.slice(1, -1).join(" ") || "",
    };
  };

  const patientNameParts = getNameParts(patientName);

  const handlePrint = () => {
    if (!printRef.current) return;

    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Form</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; padding: 20px; }
            .header { text-align: center; font-weight: bold; }
            .form-title { text-align: center; font-size: 18pt; border-bottom: 2px solid black; padding-bottom: 5px; margin: 10px 0; }
            .field-row { display: flex; flex-wrap: wrap; margin-bottom: 8px; }
            .field { flex: 1; min-width: 150px; margin-right: 15px; display: flex; align-items: baseline; }
            .field label { font-weight: bold; margin-right: 5px; }
            .field span { border-bottom: 1px solid black; flex-grow: 1; padding: 2px 0; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { text-align: center; flex: 1; }
            .signature-line { border-top: 1px solid black; margin-top: 30px; }
            .section-heading { font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; text-decoration: underline; }
            .consent { border: 1px solid black; padding: 10px; margin-top: 20px; font-style: italic; font-size: 10pt; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCancel = () => {
    setPatientName("");
    setDoctorName("");
    setVisitId("");
    setAdmittingDoctorId("");
    setWardId("");
    setBedNumber("");
    setRoomCategoryId("");
    setExpectedDischargeDate("");
    setSubmitted(false);
    toast.info("Form reset");
  };

  const handleView = () => {
    if (!patientId) return toast.error("No patient selected.");
    navigate(`/receptionist-dashboard/IPDAdmissionList/${patientId}`, {
      state: { patientName },
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <ToastContainer />

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: 8 }}
        >
          <h2>IPD Admission</h2>

          <div>
            <label>Patient:</label>
            <input readOnly value={patientName} />
          </div>

          <div>
            <label>Doctor:</label>
            <input readOnly value={doctorName || admittingDoctorId} />
          </div>

          <div>
            <label>Ward</label>
            <select
              value={wardId}
              onChange={(e) => {
                setWardId(e.target.value);
                setBedNumber("");
              }}
            >
              <option value="">Select ward</option>
              {wards.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Bed Number</label>
            <select
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              required
            >
              <option value="">Select bed</option>
              {wards
                .find((w) => w._id === wardId)
                ?.beds.map((b) => (
                  <option
                    key={b.bedNumber}
                    value={b.bedNumber}
                    disabled={b.status !== "available"}
                  >
                    {b.bedNumber} — {b.status}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Room Category</label>
            <select
              value={roomCategoryId}
              onChange={(e) => setRoomCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {roomCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Expected Discharge</label>
            <input
              type="date"
              value={expectedDischargeDate}
              onChange={(e) => setExpectedDischargeDate(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "1rem", display: "flex", gap: 10 }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: "#1976d2", color: "white" }}
            >
              Admit
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={{ flex: 1, backgroundColor: "#9e9e9e", color: "white" }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>✅ Admission Completed</h3>
          <button onClick={handlePrint}>🖨️ Print Admission Form</button>
          <button onClick={handleView}>📋 View Admissions</button>
        </div>
      )}
    </div>
  );
};

export default IPDAdmissionForm;
