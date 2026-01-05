import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IPDReportPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IPDReportPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [billingSummaryData, setBillingSummaryData] = useState(null);
  const [fumigationData, setFumigationData] = useState([]);
  const [reportType, setReportType] = useState('central');
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => window.print();

  /* ---------------- FETCH DEPARTMENTS ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/departments`, { headers })
      .then(res => setDepartments(res.data.departments || []))
      .catch(() => toast.error('Failed to load departments'));
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasFetched(false);

    try {
      let endpoint = '';
      let params = { startDate, endDate, departmentId: selectedDepartment || '' };

      switch (reportType) {
        case 'central':
          endpoint = `${BASE_URL}/api/reports/ipd-register/central`;
          break;
        case 'department':
          endpoint = `${BASE_URL}/api/reports/ipd-register/department-wise`;
          break;
        case 'ot':
          endpoint = `${BASE_URL}/api/reports/procedures/ot-register`;
          break;
        case 'anesthesia':
          endpoint = `${BASE_URL}/api/reports/anesthesia-register`;
          break;
        case 'birth':
          endpoint = `${BASE_URL}/api/reports/birth-records`;
          break;
        case 'billing':
          endpoint = `${BASE_URL}/api/reports/billing-summary`;
          break;
        case 'paymentReconciliation':
          endpoint = `${BASE_URL}/api/reports/payment-reconciliation`;
          break;
        case 'fumigation':
          endpoint = `${BASE_URL}/api/reports/ot-fumigation-report`;
          break;
        default:
          break;
      }

      const res = await axios.get(endpoint, { headers, params });

      if (reportType === 'fumigation') {
        setFumigationData(Array.isArray(res.data) ? res.data : []);
      } else {
        setReportData(res.data || []);
        setBillingSummaryData(res.data || null);
      }

      setHasFetched(true);
    } catch (err) {
      console.error(err);
      toast.error('Error generating report');
    }

    setLoading(false);
  };

  return (
    <div className="report-container">

      {/* ============ PRINT HEADER ============ */}
      <div className="print-header">
        <h2>
          NAME OF UNANI COLLEGE <br />
          Dr. M.I.J. Tibbia Unani Medical College <br />
          Versova, Andheri (W), Mumbai – 61
        </h2>
        <h4>
          Departmentwise Information of OPD, IPD, OT & LABOUR ROOM PATIENTS <br />
          (FORMAT – A)
        </h4>
        <p>
          <strong>Report:</strong> {reportType.toUpperCase()} &nbsp; | &nbsp;
          <strong>From:</strong> {startDate} &nbsp;
          <strong>To:</strong> {endDate}
        </p>
        <hr />
      </div>

      <h1 className="report-title">📋 IPD Report</h1>

      {/* ============ FILTER FORM ============ */}
      <form onSubmit={handleSubmit} className="form-section">
        <label>Report Type</label>
        <select value={reportType} onChange={e => setReportType(e.target.value)}>
          <option value="central">Central IPD Register</option>
          <option value="department">Department Wise IPD Register</option>
          <option value="ot">OT Register</option>
          <option value="anesthesia">Anesthesia Register</option>
          <option value="birth">Birth Register</option>
          <option value="billing">Billing Summary</option>
          <option value="paymentReconciliation">Payment Reconciliation</option>
        </select>

        <label>Start Date</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />

        <label>End Date</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />

        <label>Department</label>
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="">All</option>
          {departments.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>

        {hasFetched && (
          <button type="button" onClick={handlePrint} className="print-btn">
            🖨 Print Report
          </button>
        )}
      </form>

      {/* ============ CENTRAL IPD ============ */}
      {reportType === 'central' && hasFetched && Array.isArray(reportData) && (
        <div className="print-section">
          <h3>Central IPD Register</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Ward</th>
                <th>Room</th>
                <th>Bed</th>
                <th>Admission Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(r => (
                <tr key={r._id}>
                  <td>{r.patient?.fullName}</td>
                  <td>{r.doctor?.name}</td>
                  <td>{r.doctor?.department}</td>
                  <td>{r.ward?.name}</td>
                  <td>{r.roomCategory?.name}</td>
                  <td>{r.bedNumber}</td>
                  <td>{new Date(r.admissionDate).toLocaleDateString()}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============ OTHER REPORTS (ALL PRINT SAFE) ============ */}
      {hasFetched && reportType !== 'central' && (
        <div className="print-section">
          {/* Your existing tables remain unchanged */}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default IPDReportPage;
