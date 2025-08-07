import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function BillPaymentHistory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };
const BASE_URL = process.env.REACT_APP_BASE_URL;

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

  useEffect(() => {
    if (!selectedPatient) return setBills([]);
    axios.get(`${BASE_URL}/api/billing/bills/patient/${selectedPatient}`, { headers })
      .then(res => setBills(res.data.bills))
      .catch(() => setError('Could not load bills'));
  }, [selectedPatient]);

  useEffect(() => {
    if (!selectedBill) return setPayments([]);
    axios.get(`${BASE_URL}/api/billing/payments/${selectedBill._id}`, { headers })
      .then(res => setPayments(res.data.payments))
      .catch(() => setError('Could not load payments'));
  }, [selectedBill]);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>Patient Bill & Payment History</h2>

      <label><strong>Patient:</strong></label>
      <select
        value={selectedPatient}
        onChange={e => setSelectedPatient(e.target.value)}
        style={{ marginLeft: '1rem', padding: '0.4rem', fontSize: '1rem' }}
      >
        <option value="">-- Select --</option>
        {patients.map(p => (
          <option key={p._id} value={p._id}>{p.fullName}</option>
        ))}
      </select>

      {bills.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>All Bills:</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {bills.map(b => (
              <li key={b._id} style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => setSelectedBill(b)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ccc',
                    backgroundColor: selectedBill?._id === b._id ? '#e3f2fd' : '#f9f9f9',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  – {new Date(b.bill_date).toLocaleDateString()} ({b.payment_status})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedBill && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Payments for Bill</h3>

          <h4 style={{ marginTop: '1rem' }}>Charges Summary</h4>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '1.5rem',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>#</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Qty</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Unit Price</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.items?.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.description || '—'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.item_type || '—'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>₹{item.unit_price}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    ₹{(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 'bold' }}>
                <td colSpan="5" style={{ textAlign: 'right', padding: '8px', border: '1px solid #ccc' }}>Total:</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  ₹{selectedBill.items?.reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <h4>Payment History</h4>
          {payments.length === 0 ? (
            <p>No payments for this bill.</p>
          ) : (
            payments.map(p => (
              <div
                key={p._id}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <p><strong>Date:</strong> {new Date(p.payment_date).toLocaleString()}</p>
                <p><strong>Amount:</strong> ₹{p.amount_paid}</p>
                <p><strong>Method:</strong> {p.payment_method}</p>
                <p><strong>By:</strong> {p.received_by_user_id_ref.name}</p>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPatient && bills.length === 0 && (
        <p style={{ marginTop: '1rem', color: '#d32f2f' }}>No bills for this patient.</p>
      )}

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
