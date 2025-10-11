import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UploadReport() {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [uploadedReport, setUploadedReport] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const reportRef = useRef();

  // Fetch pending tests
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
      }
    };
    fetchTests();
  }, [BASE_URL]);

  // Handle upload & payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest || !file || !amount || !paymentStatus) {
      return  toast.warning("⚠️ Please fill all fields and select a file");
    }

    const formData = new FormData();
    formData.append("testId", selectedTest);
    formData.append("reportFile", file);
    formData.append("amount", amount);
    formData.append("paymentStatus", paymentStatus);
      formData.append("notes", notes);
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(
        `${BASE_URL}/api/lab/upload-report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  toast.success("✅ Report uploaded & payment created successfully!");
   

      // Set uploaded report state dynamically
   const testData = res.data.test;
const patient = testData.patientId;

setUploadedReport({
  patientName: patient.fullName,
  patientId: patient.patientId || "",
  age: patient.age || "",
  gender: patient.gender || "",
  address:patient.address || "",
    testType: testData.testType,
  testDate: new Date(testData.date).toLocaleDateString(),
  result: testData.result || "-",
 notes: notes ? [notes] : [],
  technician: res.data.technicianName || "",
  labName: patient.labName || "",
  amount,
  paymentStatus,
  file,
});
      // Reset form
      setSelectedTest("");
      setFile(null);
      setAmount("");
      setPaymentStatus("Pending");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading report");
    }
  };

const handlePrint = () => {
  if (!reportRef.current) return;

  const printContents = reportRef.current.innerHTML;
  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(`
    <html>
      <head>
        <title>Lab Report</title>
        <style>
          body { font-family: monospace; white-space: pre-line; padding: 1rem; }
          img { max-width: 100%; margin-top: 1rem; }
          embed { width: 100%; height: 600px; margin-top: 1rem; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


useEffect(() => {
  if (uploadedReport) {
    // optional: auto print or debug
    console.log("Report ready to print", uploadedReport);
  }
}, [uploadedReport]);

  return (
    <div>
      <h2>Upload Lab Report & Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Test:</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
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
          />
        </div>

        <div>
          <label>Payment Status:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div>
          <label>Choose Report File:</label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setFile(e.target.files[0])}
          />
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
        <button type="submit">Upload & Create Payment</button>
      </form>

      {/* Print Preview */}
      {uploadedReport && (
        <div>
          <h3>Report Preview</h3>
          <div
            ref={reportRef}
            style={{
              padding: "1rem",
              border: "1px solid black",
              fontFamily: "monospace",
              whiteSpace: "pre-line",
            }}
          >
            =============================<br />
            LAB TEST REPORT<br />
            =============================<br /><br />
            Patient Name : {uploadedReport.patientName}<br />
            Patient ID   : {uploadedReport.patientId}<br />
            Age          : {uploadedReport.age}<br />
            Gender       : {uploadedReport.gender}<br /><br />
           Address        : {uploadedReport.address}<br></br>
            Test Type    : {uploadedReport.testType}<br />
            Test Date    : {uploadedReport.testDate}<br />
            Status       : Completed<br /><br />
       Results:<br />
{uploadedReport.result}<br /><br />


            Notes:<br />
            {uploadedReport.notes.length > 0
              ? uploadedReport.notes.map((n, i) => <span key={i}>- {n}<br /></span>)
              : "- No notes<br />"}
            <br />
            =============================<br />
            Lab Technician: {uploadedReport.technician}<br />
            Lab Name      : {uploadedReport.labName}<br />
            =============================<br />
            <br />
            Amount        : ₹{uploadedReport.amount}<br />
            Payment Status: {uploadedReport.paymentStatus}<br />
            <br />
            {/* Render uploaded file */}
            {uploadedReport.file &&
              uploadedReport.file.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(uploadedReport.file)}
                  alt="Report"
                  style={{ width: "100%", marginTop: "1rem" }}
                />
              )}
            {uploadedReport.file &&
              uploadedReport.file.type === "application/pdf" && (
                <embed
                  src={URL.createObjectURL(uploadedReport.file)}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  style={{ marginTop: "1rem" }}
                />
              )}
          </div>
          <button onClick={handlePrint}>Print Report</button>
        </div>
      )}
    </div>
  );
}
