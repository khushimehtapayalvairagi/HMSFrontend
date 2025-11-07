import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadReportPage() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [uploadedReport, setUploadedReport] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const reportRef = useRef();

  // react-to-print setup
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "Lab Report",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          font-family: monospace;
          margin: 1rem;
        }
        .print-container {
          border: 1px solid black;
          padding: 1rem;
          page-break-after: always;
        }
        h3 {
          text-align: center;
        }
      }
    `,
  });

  // Safe print wrapper
  const handlePrintSafe = () => {
    if (uploadedReport && reportRef.current) {
      handlePrint();
    } else {
      toast.warning("Report not ready to print yet");
    }
  };

  // Fetch pending lab tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${BASE_URL}/api/lab/tests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data.tests.filter((t) => t.status === "Pending"));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tests");
      }
    };
    fetchTests();
  }, [BASE_URL]);

  // Handle report upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest || !amount || !paymentStatus) {
      return toast.warning("⚠️ Please fill all fields");
    }

    const formData = new FormData();
    formData.append("testId", selectedTest);
    formData.append("amount", amount);
    formData.append("paymentStatus", paymentStatus);
    formData.append("notes", notes);

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/lab/upload-report`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Report updated & payment created successfully!");

      const testData = res.data.test;
      const patient = testData.patientId;

      setUploadedReport({
        patientName: patient.fullName,
        patientId: patient.patientId || "",
        age: patient.age || "",
        gender: patient.gender || "",
        address: patient.address || "",
        testType: testData.testType,
        testDate: new Date(testData.date).toLocaleDateString(),
        results: testData.results && testData.results.length > 0 ? testData.results : ["-"],
        notes: notes ? [notes] : [],
        technician: res.data.technicianName || "",
        labName: patient.labName || "",
        amount,
        paymentStatus,
      });

      setSelectedTest("");
      setAmount("");
      setPaymentStatus("Pending");
      setNotes("");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Error updating report");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Update Lab Report & Create Payment</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <label>Select Test:</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            required
          >
            <option value="">--Select--</option>
            {tests.map((t) => (
              <option key={t._id} value={t._id}>
                {t.patientId?.fullName} - {t.testType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            placeholder="Enter payment amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Payment Status:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div>
          <label>Notes:</label>
          <textarea
            placeholder="Enter any remarks or notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Update Report & Create Payment</button>
      </form>

      {/* Print-ready report (off-screen) */}
      <div
        ref={reportRef}
        className="print-container"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          padding: "1rem",
          border: "1px solid black",
          fontFamily: "monospace",
          whiteSpace: "pre-line",
        }}
      >
        {uploadedReport && (
          <>
            <div>=============================</div>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>LAB TEST REPORT</div>
            <div>=============================</div>

            <div>Patient Name : {uploadedReport.patientName}</div>
            <div>Patient ID   : {uploadedReport.patientId}</div>
            <div>Age          : {uploadedReport.age}</div>
            <div>Gender       : {uploadedReport.gender}</div>
            <div>Address      : {uploadedReport.address}</div>
            <div>Test Type    : {uploadedReport.testType}</div>
            <div>Test Date    : {uploadedReport.testDate}</div>
            <div>Status       : Completed</div>

            <div>
              Results:
              {uploadedReport.results.map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>

            <div>
              Notes:
              {uploadedReport.notes.length > 0
                ? uploadedReport.notes.map((n, i) => <div key={i}>- {n}</div>)
                : <div>- No notes</div>}
            </div>

            <div>=============================</div>
            <div>Lab Technician: {uploadedReport.technician}</div>
            <div>Lab Name      : {uploadedReport.labName}</div>
            <div>=============================</div>

            <div>Amount        : ₹{uploadedReport.amount}</div>
            <div>Payment Status: {uploadedReport.paymentStatus}</div>
          </>
        )}
      </div>

      {/* Print button */}
      {uploadedReport && (
        <button
          onClick={handlePrintSafe}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🖨️ Print Report
        </button>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
