import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import './IPDReportPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const IPDReportPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('central'); // 'central' or 'department'
const [gender, setGender] = useState('');
const [deliveryType, setDeliveryType] = useState('');
const [billingSummaryData, setBillingSummaryData] = useState(null);
const [fumigationData, setFumigationData] = useState([]);
const [theaters, setTheaters] = useState([]);
  const [error, setError] = useState('');
   const BASE_URL = process.env.REACT_APP_BASE_URL;
const [selectedOtRoom, setSelectedOtRoom] = useState('');
  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`${BASE_URL}/api/admin/operation-theaters`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTheaters(res.data.theaters);
      } catch (err) {
        setError('Failed to fetch operation theaters');
      }
    };

    fetchTheaters();
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/departments`, { headers });
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

  // Submit report request
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let params = {
      startDate,
      endDate,
      departmentId: selectedDepartment || '',
    };

    let endpoint = '';

    if (reportType === 'central') {
      endpoint = `${BASE_URL}/api/reports/ipd-register/central`;
    } else if (reportType === 'department') {
      endpoint = `${BASE_URL}/api/reports/ipd-register/department-wise`;
    } else if (reportType === 'ot') {
      endpoint = `${BASE_URL}/api/reports/procedures/ot-register`;
    }
if (reportType === 'anesthesia') {
  endpoint = `${BASE_URL}/api/reports/anesthesia-register`;
  // params.procedureType = 'OT'; // Optional: 'OT' or 'Labour Room' if needed
}
else if (reportType === 'birth') {
  endpoint =  `${BASE_URL}/api/reports/birth-records`;
params = {
  startDate,
  endDate,
  gender,
  delivery_type: deliveryType, // ✅ correct key
};

}
else if (reportType === 'billing') {
  endpoint = `${BASE_URL}/api/reports/billing-summary`;

}
else if (reportType === 'paymentReconciliation') {
  endpoint = `${BASE_URL}/api/reports/payment-reconciliation`;
}

else if (reportType === 'fumigation') {
  endpoint =`${BASE_URL}/api/reports/ot-fumigation-report`;
  params = {
    startDate,
    endDate,
     otRoomId: selectedOtRoom, // Optional filtering by OT room if reused
  };
}


   const res = await axios.get(endpoint, { headers, params });

// Check if reportType is 'fumigation' and response is an array
if (reportType === 'fumigation') {
  const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
  setFumigationData(data);
} else {
  setReportData(res.data);
  setBillingSummaryData(res.data);
}
  } catch (err) {
    console.error('Error fetching report:', err);
  }

  setLoading(false);
};


  // Split the data logic
  const normalizedCentralData =
    reportType === 'central' && Array.isArray(reportData) ? reportData : [];

  const departmentWiseData =
    reportType === 'department' && Array.isArray(reportData) ? reportData : [];
 const otProcedureData =
    reportType === 'ot' && Array.isArray(reportData) ? reportData : [];
 const birthData =
    reportType === 'birth' && Array.isArray(reportData) ? reportData : [];
 
    return (
 <div className="report-container">

      <h1 className="report-title">
IPD Report</h1>

      {/* Report Type Selector */}
      <form onSubmit={handleSubmit} className="form-section">
      <div className="mb-5">
        <label className="label">Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="label"
        >
          <option value="central">Central IPD Register</option>
          <option value="department">Department Wise IPD Register</option>
                <option value="ot">OT</option>
                <option value="anesthesia">Anesthesia Register</option>
<option value="birth">Birth Record Register</option>
<option value="billing">Billing Summary</option>
<option value="paymentReconciliation">Payment Reconciliation</option>
{/* <option value="fumigation">OT Fumigation Register</option> */}



        </select>
      </div>

      {/* Filter Form */}
    {/* Filter Form */}

  <div className="mb-4">
    {/* Start Date */}
    <div>
      <label className="label">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="input-field" 
        required
      />
    </div>

    {/* End Date */}
    <div>
      <label className="block text-sm font-medium">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="select-field"
        required
      />
    </div>

    {/* Department */}
    <div>
      <label className="block text-sm font-medium">Department</label>
      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        className="mt-1 block w-full border rounded px-3 py-2"
      >
        <option value="">All</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
{reportType === 'fumigation' && (
  <div>
    <label className="block text-sm font-medium">Select OT Room</label>
    <select
      value={selectedOtRoom}
      onChange={(e) => setSelectedOtRoom(e.target.value)}
      className="mt-1 block w-full border rounded px-3 py-2"
    >
      <option value="">All</option>
    {Array.isArray(theaters) &&
  theaters.map((room) => (
    <option key={room._id} value={room._id}>
      {room.name}
    </option>
))}

    </select>
  </div>
)}

    {/* Gender Filter (ONLY for Birth) */}
    {reportType === 'birth' && (
      <>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Delivery Type</label>
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="Normal">Normal</option>
            <option value="C-section">C-section</option>
          </select>
        </div>
      </>
    )}
  </div>

  <div className="mt-4">
    <button
      type="submit"
      className="submit-btn"
      disabled={loading}
    >
      {loading ? 'Generating...' : 'Generate Report'}
    </button>
  </div>
</form>


      {/* Central Report Table */}
      {reportType === 'central' && normalizedCentralData.length > 0 && (
        <table className="table">
          <thead className="bg-gray-100">
         <tr className="table-row">

              <th className="border px-4 py-2">Patient</th>
              <th className="border px-4 py-2">Doctor</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Ward</th>
              <th className="border px-4 py-2">Room</th>
              <th className="border px-4 py-2">Bed No</th>
              <th className="border px-4 py-2">Admission Date</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {normalizedCentralData.map((entry) => (
              <tr key={entry._id} className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-2">{entry.patient?.fullName || 'N/A'}</td>
                <td className="border px-4 py-2">{entry.doctor?.name || 'Unknown'}</td>
                <td className="border px-4 py-2">{entry.doctor?.department || 'N/A'}</td>
                <td className="border px-4 py-2">{entry.ward?.name || 'N/A'}</td>
                <td className="border px-4 py-2">{entry.roomCategory?.name || 'N/A'}</td>
                <td className="border px-4 py-2">{entry.bedNumber || 'N/A'}</td>
                <td className="border px-4 py-2">{new Date(entry.admissionDate).toLocaleDateString()}</td>
               
                <td className="border px-4 py-2">{entry.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Department-Wise Report */}
      {reportType === 'department' && departmentWiseData.length > 0 && (
        <div className="space-y-6">
        {departmentWiseData.map((dept) => (
  <div key={dept.departmentId} className="bg-gray-50 p-4 border rounded">
    <h2 className="text-lg font-semibold text-blue-700 mb-2">
      Department: {dept.department} ({dept.totalAdmissions} admissions)
    </h2>
    <table className="table">
      <thead className="bg-gray-100">
       <tr className="table-row">

          <th className="border px-4 py-2">Patient</th>
          <th className="border px-4 py-2">Doctor</th>
          <th className="border px-4 py-2">Bed No</th>
          <th className="border px-4 py-2">Admission Date</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {(dept.admissions || []).map((entry) => (
          <tr key={entry._id} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{entry.patient?.fullName || 'N/A'}</td>
            <td className="border px-4 py-2">{entry.doctor?.name || 'Unknown'}</td>
            <td className="border px-4 py-2">{entry.bedNumber || 'N/A'}</td>
            <td className="border px-4 py-2">
              {entry.admissionDate
                ? new Date(entry.admissionDate).toLocaleDateString()
                : 'N/A'}
            </td>
            <td className="border px-4 py-2">{entry.status || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}

        </div>
      )}
      {/* OT Procedure Register */}
{reportType === 'ot' && Array.isArray(otProcedureData) && otProcedureData.length > 0 && (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">OT Procedure Register</h2>
    <table className="table">
      <thead className="bg-gray-100">
     <tr className="table-row">

          <th className="border px-4 py-2">Patient</th>
          <th className="border px-4 py-2">Doctor</th>
          <th className="border px-4 py-2">Department</th>
          <th className="border px-4 py-2">Procedure</th>
          <th className="border px-4 py-2">Cost</th>
          <th className="border px-4 py-2">Scheduled Date</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {otProcedureData.map((proc) => (
          <tr key={proc._id} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{proc.patient?.fullName || 'N/A'}</td>
            <td className="border px-4 py-2">{proc.surgeon?.name || 'N/A'}</td>
            <td className="border px-4 py-2">{proc.department?.name || 'N/A'}</td>
            <td className="border px-4 py-2">{proc.procedure?.name || 'N/A'}</td>
            <td className="border px-4 py-2">{proc.procedure?.cost || 'N/A'}</td>
            <td className="border px-4 py-2">
              {proc.scheduledDateTime
                ? new Date(proc.scheduledDateTime).toLocaleDateString()
                : 'N/A'}
            </td>
            <td className="border px-4 py-2">{proc.status || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{/* Anesthesia Register */}
{reportType === 'anesthesia' && Array.isArray(reportData) && reportData.length > 0 && (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Anesthesia Register</h2>
    <table className="table">
      <thead className="bg-gray-100">
      <tr className="table-row">
           
          <th className="border px-4 py-2">Patient</th>
          <th className="border px-4 py-2">Anesthetist</th>
           {/* <th className="border px-4 py-2">Procedure</th>  */}
          <th className="border px-4 py-2">Anesthesia Type</th>
          <th className="border px-4 py-2">Anesthesia Name</th>
          <th className="border px-4 py-2">Induce Time</th>
          <th className="border px-4 py-2">End Time</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((entry) => (
          <tr key={entry._id} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{entry.patient?.fullName || 'N/A'}</td>
            <td className="border px-4 py-2">{entry.anesthetist?.name || 'N/A'}</td>
            {/* <td className="border px-4 py-2">{entry.procedureType?.name || 'N/A'}</td>  */}
            <td className="border px-4 py-2">{entry.anesthesiaType || 'N/A'}</td>
            <td className="border px-4 py-2">{entry.anesthesiaName || 'N/A'}</td>
            <td className="border px-4 py-2">
              {entry.induceTime ? new Date(entry.induceTime).toLocaleString() : 'N/A'}
            </td>
            <td className="border px-4 py-2">
              {entry.endTime ? new Date(entry.endTime).toLocaleString() : 'N/A'}
            </td>
          </tr>
        ))}
        {/* Birth Record Register */}
        
{/* Birth Record Register */}



      </tbody>
    </table>
  </div>
)}
{reportType === 'birth' && (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Birth Record Register</h2>
    <table className="table">
      <thead className="bg-gray-100">
       <tr className="table-row">

          <th className="border px-4 py-2">Patient Name</th>
          <th className="border px-4 py-2">Baby Name</th>
          <th className="border px-4 py-2">Gender</th>
          <th className="border px-4 py-2">DOB</th>
          <th className="border px-4 py-2">Time of Birth</th>
          <th className="border px-4 py-2">Weight</th>
          <th className="border px-4 py-2">Delivery Type</th>
          <th className="border px-4 py-2">Captured By</th>
        </tr>
      </thead>
      <tbody>
        {birthData.length === 0 ? (
          <tr>
            <td className="text-center border px-4 py-2" colSpan="8">
              No birth records found.
            </td>
          </tr>
        ) : (
          birthData.map((entry) => (
            <tr key={entry._id} className="bg-white hover:bg-gray-50">
              <td className="border px-4 py-2">{entry.patientId?.fullName || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.babyName || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.gender || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.dobBaby ? new Date(entry.dobBaby).toLocaleDateString() : 'N/A'}</td>
              <td className="border px-4 py-2">{entry.timeOfBirth || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.weight || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.deliveryType || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.capturedByUserId?.name || 'N/A'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}

{reportType === 'billing' && billingSummaryData && (
  <div className="bg-white p-4 rounded shadow mt-6">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Billing Summary Report</h2>

    <div className="mb-4">
      <p className="text-md font-semibold">
        <span className="text-gray-700">Grand Total:</span> ₹{typeof billingSummaryData.summary?.grandTotal === 'number' ? billingSummaryData.summary.grandTotal.toFixed(2) : '0.00'}

      </p>
    </div>

    <h3 className="text-md font-semibold text-blue-600 mt-4 mb-2">Breakdown by Item Type</h3>
    <table className="table">
      <thead className="bg-gray-100">
        <tr className="table-row">

          <th className="border px-4 py-2">Item Type</th>
          <th className="border px-4 py-2">Total Amount</th>
          <th className="border px-4 py-2">Count</th>
        </tr>
      </thead>
      <tbody>
        {(billingSummaryData.summary?.breakdown || []).map((item, index) => (
          <tr key={index} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{item.type}</td>
            <td className="border px-4 py-2">₹{typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
</td>
            <td className="border px-4 py-2">{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="text-md font-semibold text-blue-600 mb-2">Payment Status Breakdown</h3>
    <table className="table">
      <thead className="bg-gray-100">
      <tr className="table-row">

          <th className="border px-4 py-2">Payment Status</th>
          <th className="border px-4 py-2">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {(billingSummaryData.paymentStatusBreakdown || []).map((status, index) => (
          <tr key={index} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{status._id}</td>
            <td className="border px-4 py-2">₹{typeof status.totalAmount === 'number' ? status.totalAmount.toFixed(2) : '0.00'}
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{reportType === 'paymentReconciliation' && billingSummaryData && (
  <div className="bg-white p-4 rounded shadow mt-6">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Payment Reconciliation Report</h2>

    <div className="mb-4">
      <p className="text-md font-semibold">
        <span className="text-gray-700">Total Received:</span> ₹{typeof billingSummaryData.totalReceived === 'number' ? billingSummaryData.totalReceived.toFixed(2) : '0.00'}

      </p>
    </div>

    <h3 className="text-md font-semibold text-blue-600 mt-4 mb-2">Breakdown by Payment Method</h3>
    <table className="table">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Payment Method</th>
          <th className="border px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(billingSummaryData.methodBreakdown || {}).map(([method, amount]) => (
          <tr key={method} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{method}</td>
            <td className="border px-4 py-2">₹{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}
</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="text-md font-semibold text-blue-600 mb-2">Breakdown by User</h3>
    <table className="table">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Received By</th>
          <th className="border px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(billingSummaryData.userBreakdown || {}).map(([user, amount]) => (
          <tr key={user} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{user}</td>
            <td className="border px-4 py-2">₹{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}
</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="text-md font-semibold text-blue-600 mb-2">Payment Transactions</h3>
    <table className="table">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Method</th>
          <th className="border px-4 py-2">Amount</th>
          <th className="border px-4 py-2">Received By</th>
          <th className="border px-4 py-2">Bill ID</th>
        </tr>
      </thead>
      <tbody>
        {(billingSummaryData.payments || []).map((p) => (
          <tr key={p._id} className="bg-white hover:bg-gray-50">
            <td className="border px-4 py-2">{new Date(p.payment_date).toLocaleString()}</td>
            <td className="border px-4 py-2">{p.payment_method}</td>
            <td className="border px-4 py-2">₹{typeof p.amount_paid === 'number' ? p.amount_paid.toFixed(2) : '0.00'}
</td>
            <td className="border px-4 py-2">{p.received_by_user_id_ref?.name || 'N/A'}</td>
            <td className="border px-4 py-2">{p.bill_id_ref?._id || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{Array.isArray(fumigationData) && reportType === 'fumigation' && (
  <div className="bg-white p-4 rounded shadow mt-6">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">OT Fumigation Report</h2>
    <table className="table">
      <thead className="bg-gray-100">
      <tr className="table-row">

          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">OT Room</th>
          <th className="border px-4 py-2">Performed By</th>
          <th className="border px-4 py-2">Role</th>
          <th className="border px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {fumigationData.length === 0 ? (
          <tr>
            <td className="border px-4 py-2 text-center" colSpan="5">No records found.</td>
          </tr>
        ) : (
          fumigationData.map((entry) => (
            <tr key={entry._id} className="bg-white hover:bg-gray-50">
              <td className="border px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{entry.otRoomId?.name || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.performedBy?.name || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.performedBy?.role || 'N/A'}</td>
              <td className="border px-4 py-2">{entry.remarks || 'N/A'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}




    </div>
  );
};

export default IPDReportPage;
