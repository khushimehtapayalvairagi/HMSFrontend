import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OPDReportPage.css";

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

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/specialties`, { headers })
      .then(res => setSpecialties(res.data.specialties || []))
      .catch(() => toast.error("Failed to load specialties"));
  }, []);

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
        setDepartmentWiseData(res.data.specialtyWiseRegister || {});
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
    <div className="opd-report-container">
      <ToastContainer />

      {/* ================= FILTER (NO PRINT) ================= */}
      <div className="filter-box no-print">
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
            <option value="central">Central OPD</option>
            <option value="department">Department Wise</option>
            <option value="doctor">Doctor Wise</option>
            <option value="newold">New vs Old</option>
          </select>
        </label>

        <button onClick={handleFetchReports}>Generate</button>
        {hasFetched && <button onClick={handlePrint}>🖨 Print</button>}
      </div>

      {/* ================= PRINT AREA ================= */}
      <div id="print-area">

        <div className="print-header">
          <h2>Dr. M.I.J. Tibbia Unani Medical College</h2>
          <p>Versova, Andheri (W), Mumbai – 61</p>
          <p><b>OPD REPORT</b></p>
          <p><b>From:</b> {startDate} &nbsp; <b>To:</b> {endDate}</p>
          <hr />
        </div>

        {/* CENTRAL */}
        {reportType === "central" && hasFetched && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
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
        )}

        {/* DEPARTMENT */}
        {reportType === "department" && hasFetched &&
          Object.entries(departmentWiseData).map(([dept, rows], idx) => (
            <div key={idx}>
              <h4>{dept}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r._id}>
                      <td>{i + 1}</td>
                      <td>{new Date(r.consultationDateTime).toLocaleDateString()}</td>
                      <td>{r.patientId?.fullName}</td>
                      <td>{r.doctorId?.userId?.name}</td>
                      <td>{r.diagnosis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        }

        {/* DOCTOR */}
        {reportType === "doctor" && hasFetched &&
          doctorWiseData.map((d, i) => (
            <div key={i}>
              <h4>Dr. {d.doctor.name}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Diagnosis</th>
                  </tr>
                </thead>
                <tbody>
                  {d.consultations.map((c, idx) => (
                    <tr key={idx}>
                      <td>{new Date(c.consultationDateTime).toLocaleDateString()}</td>
                      <td>{c.patientId?.fullName}</td>
                      <td>{c.diagnosis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        }

        {/* NEW VS OLD */}
        {reportType === "newold" && hasFetched && (
          <table>
            <tbody>
              <tr><th>Total</th><td>{newVsOldData?.totalConsultations}</td></tr>
              <tr><th>New</th><td>{newVsOldData?.newPatients}</td></tr>
              <tr><th>Old</th><td>{newVsOldData?.oldPatients}</td></tr>
            </tbody>
          </table>
        )}
      </div>

      {/* ================= INTERNAL CSS (FIXED CONTAINER) ================= */}
      <style>{`
        .opd-report-container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 20px;
          background: #fff;
        }

        .filter-box {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-bottom: 20px;
          background: #f9f9f9;
        }

        .filter-box label {
          display: flex;
          flex-direction: column;
          font-size: 13px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          page-break-inside: avoid;
        }

        th, td {
          border: 1px solid #000;
          padding: 6px;
          font-size: 13px;
          text-align: left;
        }

        thead {
          background: #eee;
          display: table-header-group;
        }

        tr {
          page-break-inside: avoid;
        }

        .print-header {
          display: none;
          text-align: center;
          margin-bottom: 10px;
        }

        @media print {
          body * {
            visibility: hidden;
          }

          #print-area, #print-area * {
            visibility: visible;
          }

          #print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }

          .print-header {
            display: block;
          }

          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default OPDReportPage;
