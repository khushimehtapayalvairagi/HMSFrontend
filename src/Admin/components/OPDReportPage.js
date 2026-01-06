// import React, { useState, useRef } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
//   TextField,
//   Button,
// } from "@mui/material";

// export default function OPDReportPage({standalone}) {
//   const [report, setReport] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const printRef = useRef();

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const [year, month, day] = dateStr.split("-").map(Number);
//     return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const fetchReport = async () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both From Date and To Date");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("jwt");
//       const res = await axios.get(`${BASE_URL}/api/reports/monthly-opd-ipd-report`, {
//         params: { fromDate, toDate },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setReport(res.data.report || []);
//       setDepartments(res.data.departments || []);
//     } catch (err) {
//       console.error("Report fetch error:", err.response?.data || err.message);
//       alert("Error fetching report. Check console for details.");
//     }
//   };
// const handlePrint = () => {
//   window.print();
// };


//   return (
//       <div className={standalone ? 'standalone-report' : 'with-dashboard'}>
//       {!standalone && <div className="navbar no-print">Navbar goes here</div>}
//     <div id="printable-report">
//  <div style={{ padding: 20 }}>
//       {/* Controls - hidden in print */}
//       <div className="no-print" style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
//         <TextField
//           type="date"
//           label="From Date"
//           InputLabelProps={{ shrink: true }}
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         />
//         <TextField
//           type="date"
//           label="To Date"
//           InputLabelProps={{ shrink: true }}
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         />
//         <Button variant="contained" onClick={fetchReport}>
//           Generate
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={handlePrint}>
//           Print Report
//         </Button>
//       </div>

//       {/* Printable content */}
//       <div ref={printRef}>
//         <Typography variant="h6" align="center" gutterBottom>
//           NAME OF UNANI COLLEGE: Dr. M.I.J. Tibbia Unani Medical College, Versova, Andheri (W), Mumbai-61
//         </Typography>
//         <Typography variant="subtitle1" align="center" gutterBottom>
//           Departmentwise Information of OPD, IPD, OT & LABOUR ROOM PATIENTS (FORMAT-A)
//         </Typography>

//         <Table>
//           <TableHead>
//             <TableRow style={{ backgroundColor: "#2c3e50" }}>
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>Sr.No</TableCell>
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>From – To</TableCell>

//               {departments.map((d) => (
//                 <TableCell key={`opd-${d}`} style={{ color: "white", border: "1px solid #000" }}>
//                   {d} (OPD)
//                 </TableCell>
//               ))}
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>OPD Total</TableCell>
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>OPD Daily Avg</TableCell>

//               {departments.map((d) => (
//                 <TableCell key={`ipd-${d}`} style={{ color: "white", border: "1px solid #000" }}>
//                   {d} (IPD)
//                 </TableCell>
//               ))}
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>IPD Total</TableCell>
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>IPD Daily Avg</TableCell>

//               <TableCell style={{ color: "white", border: "1px solid #000" }}>OT Total</TableCell>
//               <TableCell style={{ color: "white", border: "1px solid #000" }}>Labour Total</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {report.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={departments.length * 2 + 6} align="center" style={{ border: "1px solid #000" }}>
//                   No data available
//                 </TableCell>
//               </TableRow>
//             ) : (
//               report.map((r, idx) => (
//                 <TableRow key={idx}>
//                   <TableCell style={{ border: "1px solid #000" }}>{idx + 1}</TableCell>
//                   <TableCell style={{ border: "1px solid #000" }}>{`${formatDate(r.fromDate)} to ${formatDate(
//                     r.toDate
//                   )}`}</TableCell>

//                   {departments.map((d) => (
//                     <TableCell key={`opd-${d}-${idx}`} style={{ border: "1px solid #000" }}>
//                       {r.opd[d] || 0}
//                     </TableCell>
//                   ))}
//                   <TableCell style={{ border: "1px solid #000" }}>{r.opd.total}</TableCell>
//                   <TableCell style={{ border: "1px solid #000" }}>{r.opd.dailyAvg}</TableCell>

//                   {departments.map((d) => (
//                     <TableCell key={`ipd-${d}-${idx}`} style={{ border: "1px solid #000" }}>
//                       {r.ipd[d] || 0}
//                     </TableCell>
//                   ))}
//                   <TableCell style={{ border: "1px solid #000" }}>{r.ipd.total}</TableCell>
//                   <TableCell style={{ border: "1px solid #000" }}>{r.ipd.dailyAvg}</TableCell>

//                   <TableCell style={{ border: "1px solid #000" }}>{r.ot.total}</TableCell>
//                   <TableCell style={{ border: "1px solid #000" }}>{r.labour.total}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <style>
//         {`
//           @media print {
//             .no-print, .navbar, .sidebar { display: none !important; }
//             body { margin: 10mm; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//             table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
//             th, td { border: 1px solid #000 !important; padding: 6px !important; text-align: center; }
//             th { background-color: #2c3e50 !important; color: white !important; }
//           }
//         `}
//       </style>
//     </div>
//     </div>
//    </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OPDReportPage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");
  const headers = { Authorization: `Bearer ${token}` };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState("");

  const [reportType, setReportType] = useState("central");
  const [hasFetched, setHasFetched] = useState(false);

  const [centralData, setCentralData] = useState([]);
  const [departmentWiseData, setDepartmentWiseData] = useState({});
  const [doctorWiseData, setDoctorWiseData] = useState([]);
  const [newVsOldData, setNewVsOldData] = useState(null);

  /* ---------------- FETCH SPECIALTIES ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/specialties`, { headers })
      .then(res => setSpecialties(res.data.specialties || []))
      .catch(() => toast.error("Failed to load specialties"));
  }, []);

  /* ---------------- FETCH REPORT ---------------- */
  const handleFetchReports = async () => {
    if (!startDate || !endDate) {
      toast.warning("Select date range");
      return;
    }

    const params = { startDate, endDate };
    if (specialtyId) params.specialtyId = specialtyId;

    try {
      setHasFetched(false);

      if (reportType === "central") {
        const res = await axios.get(`${BASE_URL}/api/reports/opd-register`, { params, headers });
        setCentralData(res.data.consultations || []);
      }

      if (reportType === "department") {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/department-wise`,
          { params, headers }
        );
        setDepartmentWiseData(res.data.departmentWiseRegister || {});
      }

      if (reportType === "doctor") {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/doctor-wise`,
          { params, headers }
        );
        setDoctorWiseData(res.data || []);
      }

      if (reportType === "newold") {
        const res = await axios.get(
          `${BASE_URL}/api/reports/opd-register/new-vs-old`,
          { params, headers }
        );
        setNewVsOldData(res.data || null);
      }

      setHasFetched(true);
    } catch {
      toast.error("Failed to fetch report");
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="opd-container">
      <ToastContainer />

      {/* ---------------- INTERNAL CSS ---------------- */}
      <style>{`
        body { counter-reset: page; }

        .opd-container {
          padding: 20px;
          background: #f3f4f6;
        }

        .filter-box {
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
          gap: 15px;
        }

        label {
          font-size: 14px;
          font-weight: 600;
        }

        input, select {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }

        button {
          padding: 10px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .print-header {
          display: none;
          text-align: center;
        }

        .print-section {
          background: #fff;
          padding: 10px;
          margin-top: 20px;
          page-break-after: always;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 13px;
        }

        th, td {
          border: 1px solid #000;
          padding: 6px;
        }

        th {
          background: #e5e7eb;
        }

        .footer {
          display: none;
        }

        @media print {
          .filter-box, button {
            display: none;
          }

          .print-header {
            display: block;
          }

          .footer {
            display: block;
            position: fixed;
            bottom: 10px;
            width: 100%;
            text-align: center;
            font-size: 12px;
          }

          .footer:after {
            counter-increment: page;
            content: "Page " counter(page);
          }
        }
      `}</style>

      {/* ---------------- FILTER FORM ---------------- */}
      <div className="filter-box">
        <label>
          Start Date
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>

        <label>
          End Date
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>

        <label>
          Department
          <select value={specialtyId} onChange={e => setSpecialtyId(e.target.value)}>
            <option value="">All</option>
            {specialties.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label>
          Report Type
          <select value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="central">Central OPD (Format A)</option>
            <option value="department">Department Wise (Format A)</option>
            <option value="doctor">Doctor Wise (Format B)</option>
            <option value="newold">New vs Old</option>
          </select>
        </label>

        <button onClick={handleFetchReports}>Generate</button>
        {hasFetched && <button onClick={handlePrint}>🖨 Print</button>}
      </div>

      {/* ---------------- PRINT HEADER ---------------- */}
      <div className="print-header">
        <h3>NAME OF UNANI COLLEGE</h3>
        <h2>Dr. M.I.J. Tibbia Unani Medical College</h2>
        <p>Versova, Andheri (W), Mumbai – 61</p>
        <p><b>OPD REPORT</b></p>
        <p><b>From:</b> {startDate} &nbsp;&nbsp; <b>To:</b> {endDate}</p>
        <hr />
      </div>

      {/* ---------------- CENTRAL OPD ---------------- */}
      {reportType === "central" && hasFetched && (
        <div className="print-section">
          <h4>Central OPD Register (FORMAT – A)</h4>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {centralData.map((c, i) => (
                <tr key={i}>
                  <td>{new Date(c.consultationDateTime).toLocaleDateString()}</td>
                  <td>{c.patientId?.fullName}</td>
                  <td>{c.doctorId?.userId?.name}</td>
                  <td>{c.doctorId?.specialty?.name}</td>
                  <td>{c.diagnosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
{/* ---------------- DEPARTMENT WISE ---------------- */}
       {reportType === "department" && hasFetched &&
           Object.keys(departmentWiseData).length === 0 ? (
             <div className="print-section">
             <p>No department-wise data available</p>
           </div>
   ) : (
    Object.entries(departmentWiseData).map(([deptName, consultations], idx) => (
      <div className="print-section" key={idx}>
        <h4>Department Wise OPD Register (FORMAT – A)</h4>
        <p><b>Department:</b> {deptName}</p>

        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Chief Complaint</th>
              <th>Diagnosis</th>
            </tr>
          </thead>

          <tbody>
            {consultations.map((c, i) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td>{new Date(c.consultationDateTime).toLocaleDateString()}</td>
                <td>{c.patientId?.fullName || "-"}</td>
                <td>{c.doctorId?.userId?.name || "-"}</td>
                <td>{c.chiefComplaint || "-"}</td>
                <td>{c.diagnosis || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))
}

      {/* ---------------- DOCTOR WISE ---------------- */}
      {reportType === "doctor" && hasFetched &&
        doctorWiseData.map((d, i) => (
          <div className="print-section" key={i}>
            <h4>Doctor Wise OPD (FORMAT – B)</h4>
            <p><b>Doctor:</b> Dr. {d.doctor.name}</p>
            <p><b>Specialty:</b> {d.doctor.specialty}</p>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Complaint</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {d.consultations.map((c, idx) => (
                  <tr key={idx}>
                    <td>{new Date(c.consultationDateTime).toLocaleDateString()}</td>
                    <td>{c.patientId?.fullName}</td>
                    <td>{c.chiefComplaint}</td>
                    <td>{c.diagnosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      }

      {/* ---------------- NEW VS OLD ---------------- */}
      {reportType === "newold" && hasFetched && (
        <div className="print-section">
          <h4>New vs Old OPD Summary</h4>
          <table>
            <tbody>
              <tr><th>Total Consultations</th><td>{newVsOldData?.totalConsultations}</td></tr>
              <tr><th>New Patients</th><td>{newVsOldData?.newPatients}</td></tr>
              <tr><th>Old Patients</th><td>{newVsOldData?.oldPatients}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="footer">Dr. M.I.J. Tibbia Unani Medical College</div>
    </div>
  );
};

export default OPDReportPage;


