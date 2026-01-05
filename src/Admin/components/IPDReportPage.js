import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IPDReportPage = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("jwt");
  const headers = { Authorization: `Bearer ${token}` };

  const [specialties, setSpecialties] = useState([]);
  const [reportType, setReportType] = useState("central");

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gender, setGender] = useState("");
  const [deliveryType, setDeliveryType] = useState("");

  const [reportData, setReportData] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH SPECIALTIES ---------------- */
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/specialties`, { headers })
      .then((res) => setSpecialties(res.data.specialties || []))
      .catch(() => toast.error("Failed to load specialties"));
  }, []);

  /* ---------------- FETCH REPORT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "";
      let params = { startDate, endDate };

      switch (reportType) {
        case "central":
          endpoint = `${BASE_URL}/api/reports/ipd-register/central`;
          break;
        case "department":
          endpoint = `${BASE_URL}/api/reports/ipd-register/department-wise`;
          params.specialtyId = selectedSpecialty;
          break;
        case "ot":
          endpoint = `${BASE_URL}/api/reports/procedures/ot-register`;
          break;
        case "anesthesia":
          endpoint = `${BASE_URL}/api/reports/anesthesia-register`;
          break;
        case "birth":
          endpoint = `${BASE_URL}/api/reports/birth-records`;
          params.gender = gender;
          params.delivery_type = deliveryType;
          break;
        case "billing":
          endpoint = `${BASE_URL}/api/reports/billing-summary`;
          break;
        case "payment":
          endpoint = `${BASE_URL}/api/reports/payment-reconciliation`;
          break;
        default:
          return;
      }

      const res = await axios.get(endpoint, { headers, params });

      if (reportType === "billing") {
        setBillingSummary(res.data);
        setReportData([]);
        setPaymentSummary(null);
      } else if (reportType === "payment") {
        setPaymentSummary(res.data);
        setReportData([]);
        setBillingSummary(null);
      } else if (reportType === "birth") {
        setReportData(res.data ? [res.data] : []);
        setBillingSummary(null);
        setPaymentSummary(null);
      } else {
        setReportData(res.data || []);
        setBillingSummary(null);
        setPaymentSummary(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report");
    }

    setLoading(false);
  };

  /* ---------------- RENDER TABLES ---------------- */
  const renderDepartmentWise = () =>
    reportData.map((dept, idx) => (
      <div key={idx} className="print-section">
        <h4>{dept.specialty}</h4>
        <p>Total Admissions: {dept.totalAdmissions}</p>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Ward</th>
              <th>Bed</th>
              <th>Admission Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dept.admissions.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.patient?.fullName}</td>
                <td>{r.doctor?.name}</td>
                <td>{r.ward?.name}</td>
                <td>{r.bedNumber}</td>
                <td>{new Date(r.admissionDate).toLocaleDateString()}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));

  const renderOTAnesthesia = () =>
    reportData.length > 0 && (
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Patient</th>
            <th>{reportType === "ot" ? "Procedure" : "Anesthesia"}</th>
            <th>{reportType === "ot" ? "Surgeon" : "Anesthetist"}</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((r, i) => (
            <tr key={r._id}>
              <td>{i + 1}</td>
              <td>{r.patient?.fullName}</td>
              <td>{reportType === "ot" ? r.procedure?.name : r.anesthesiaName}</td>
              <td>{reportType === "ot" ? r.surgeon?.name : r.anesthetist?.name}</td>
              <td>
                {new Date(r.scheduledDateTime || r.induceTime).toLocaleString()}
              </td>
              <td>
                {new Date(r.endTime || r.scheduledDateTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

  const renderBirth = () =>
    reportData.length > 0 && (
      <table>
        <thead>
          <tr>
            <th>Total Births</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((r, i) => (
            <tr key={i}>
              <td>{r.totalBirths}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <div className="report-container">
      <ToastContainer />

      {/* PRINT HEADER */}
      <div className="print-header">
        <h2>NAME OF UNANI COLLEGE</h2>
        <h3>Dr. M.I.J. Tibbia Unani Medical College</h3>
        <p>Versova, Andheri (W), Mumbai – 61</p>
        <p>
          <strong>Report:</strong> {reportType.toUpperCase()} &nbsp; | &nbsp;
          <strong>From:</strong> {startDate} &nbsp;
          <strong>To:</strong> {endDate}
        </p>
        <hr />
      </div>

      <h1 className="report-title">IPD / OT / Anesthesia / Birth / Billing Reports</h1>

      {/* FILTER FORM */}
      <form className="form-section" onSubmit={handleSubmit}>
        <div>
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="central">Central IPD Register</option>
            <option value="department">Department Wise IPD</option>
            <option value="ot">OT Register</option>
            <option value="anesthesia">Anesthesia Register</option>
            <option value="birth">Birth Register</option>
            <option value="billing">Billing Summary</option>
            <option value="payment">Payment Reconciliation</option>
          </select>
        </div>

        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {reportType === "department" && (
          <div>
            <label>Department</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All</option>
              {specialties.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {reportType === "birth" && (
          <>
            <div>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">All</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label>Delivery Type</label>
              <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                <option value="">All</option>
                <option>Normal</option>
                <option>C-section</option>
              </select>
            </div>
          </>
        )}

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          type="button"
          className="submit-btn"
          onClick={() => window.print()}
          style={{ marginLeft: "10px" }}
        >
          🖨 Print
        </button>
      </form>

      {/* TABLES */}
      {reportType === "central" && reportData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Ward</th>
              <th>Bed</th>
              <th>Admission Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.patient?.fullName}</td>
                <td>{r.doctor?.name}</td>
                <td>{r.doctor?.specialty}</td>
                <td>{r.ward?.name}</td>
                <td>{r.bedNumber}</td>
                <td>{new Date(r.admissionDate).toLocaleDateString()}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {reportType === "department" && reportData.length > 0 && renderDepartmentWise()}

      {(reportType === "ot" || reportType === "anesthesia") && reportData.length > 0 &&
        renderOTAnesthesia()}

      {reportType === "birth" && reportData.length > 0 && renderBirth()}

      {reportType === "billing" && billingSummary && (
        <table>
          <thead>
            <tr>
              <th>Payment Status</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {billingSummary.paymentStatusBreakdown.map((p, i) => (
              <tr key={i}>
                <td>{p._id}</td>
                <td>₹ {p.totalAmount}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Grand Total</strong>
              </td>
              <td>
                <strong>₹ {billingSummary.totalAmount}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {reportType === "payment" && paymentSummary && (
        <table>
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(paymentSummary.methodBreakdown).map(([method, amount], i) => (
              <tr key={i}>
                <td>{method}</td>
                <td>₹ {amount}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Grand Total</strong>
              </td>
              <td>
                <strong>₹ {paymentSummary.totalReceived}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* INTERNAL CSS */}
      <style>{`
        body { font-family: serif; }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #000;
          padding: 6px;
          font-size: 13px;
        }

        th {
          background: #eee;
        }

        .form-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
        }

        .submit-btn {
          padding: 10px 15px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .print-header {
          display: none;
          text-align: center;
        }

        .print-section {
          margin-top: 20px;
        }

        footer::after {
          content: "Page " counter(page);
        }

        @media print {
          .form-section,
          .submit-btn,
          .toast-container,
          .report-title {
            display: none !important;
          }
          .print-header {
            display: block;
          }
          footer::after {
            position: fixed;
            bottom: 10px;
            right: 20px;
            font-size: 12px;
          }
        }
      `}</style>
      <footer />
    </div>
  );
};

export default IPDReportPage;
