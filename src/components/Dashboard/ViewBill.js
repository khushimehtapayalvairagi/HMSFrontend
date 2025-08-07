import React, { useState, useEffect } from 'react';
import axios from 'axios';
 import { toast } from 'react-toastify';

function ViewBill() {
  const [patientId, setPatientId] = useState('');
  const [billId, setBillId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);

    const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };

   useEffect(() => {
     const token = localStorage.getItem('jwt');
 
     const fetchAdmittedPatients = async () => {
       try {
         const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
           headers: { Authorization: `Bearer ${token}` }
         });
 
         const allPatients = patientRes.data.patients;
         const admittedPatients = [];
 
         for (const patient of allPatients) {
           const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
             headers: { Authorization: `Bearer ${token}` }
           });
 
           const admissions = res.data.admissions || [];
           if (admissions.some(adm => adm.status === 'Admitted')) {
             admittedPatients.push(patient);
           }
         }
 
         setPatients(admittedPatients);
       } catch (error) {
         toast.error('Failed to load admitted patients');
       }
     };
 
     fetchAdmittedPatients();
   }, []);
 
 
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      let res;
      if (billId) {
        res = await axios.get(`${BASE_URL}/api/billing/bills/${billId}`, { headers });
        setResult({ type: 'single', data: res.data.bill });
      } else if (patientId) {
        res = await axios.get(`${BASE_URL}/api/billing/bills/patient/${patientId}`, { headers });
        setResult({ type: 'list', data: res.data.bills });
      } else {
        setError('Enter either a Bill ID or Patient ID');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching data');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>Lookup Bill or Bills by Patient</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.8rem' }}>
          <label><strong>Bill ID:</strong> </label>
          <input
            type="text"
            value={billId}
            onChange={(e) => setBillId(e.target.value)}
            style={{ padding: '0.4rem', marginLeft: '1rem', width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '0.8rem' }}>
          <label><strong>Patient:</strong></label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{ padding: '0.4rem', marginLeft: '1rem', width: '220px' }}
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p._id} value={p._id}>{p.fullName}</option>
            ))}
          </select>
        </div>

        <button type="submit" style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
          Fetch
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {result && result.type === 'single' && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Bill Details (Raw):</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {result && result.type === 'list' && (
        <div>
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>All Bills for Patient:</h3>
          {result.data.length === 0 ? (
            <p>No bills found for this patient.</p>
          ) : result.data.map(b => (
            <div
              key={b._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#fafafa'
              }}
            >
              <p><strong>Date:</strong> {new Date(b.bill_date).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹{b.total_amount}</p>
              <p><strong>Status:</strong> {b.payment_status}</p>

              <h4 style={{ marginTop: '1rem' }}>Charges Summary</h4>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem'
              }}>
                <thead style={{ backgroundColor: '#f0f0f0' }}>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Description</th>
                    <th style={th}>Type</th>
                    <th style={th}>Qty</th>
                    <th style={th}>Unit Price</th>
                    <th style={th}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {b.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td style={td}>{idx + 1}</td>
                      <td style={td}>{item.description || '—'}</td>
                      <td style={td}>{item.item_type || '—'}</td>
                      <td style={td}>{item.quantity}</td>
                      <td style={td}>₹{item.unit_price}</td>
                      <td style={td}>₹{(item.quantity * item.unit_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" style={{ ...td, textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ ...td, fontWeight: 'bold' }}>
                      ₹{b.items?.reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shared inline styles
const th = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left'
};

const td = {
  border: '1px solid #ccc',
  padding: '8px'
};

export default ViewBill;
