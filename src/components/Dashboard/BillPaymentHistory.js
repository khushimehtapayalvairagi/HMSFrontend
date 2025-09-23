import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BillPaymentHistory() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };
  const BASE_URL = process.env.REACT_APP_BASE_URL;
const isMobile = useMediaQuery('(max-width:600px)');

 useEffect(() => {
  const fetchAllPatients = async () => {
    try {
      const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, { headers });
      setPatients(patientRes.data.patients || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load patients');
    }
  };

  fetchAllPatients();
}, []);



  useEffect(() => {
    if (!selectedPatient) return setBills([]);
    axios.get(`${BASE_URL}/api/billing/bills/patient/${selectedPatient}`, { headers })
      .then(res => setBills(res.data.bills))
      .catch(() => setError('Could not load bills'));
  }, [selectedPatient]);

  const handleBillClick = async (bill) => {
    setSelectedBill(bill);
    try {
      const res = await axios.get(`${BASE_URL}/api/billing/payments/${bill._id}`, { headers });
      setPayments(res.data.payments);
    } catch {
      setError('Could not load payments');
    }
    setOpenDialog(true);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Patient Bill & Payment History</h2>

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
          <h3>All Bills:</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {bills.map(b => (
              <li key={b._id} style={{ marginBottom: '0.5rem' }}>
                <Button
                  variant="contained"
                  color={selectedBill?._id === b._id ? "primary" : "success"}
                  onClick={() => handleBillClick(b)}
                  fullWidth
                  style={{ justifyContent: 'flex-start' }}
                >
                  {new Date(b.bill_date).toLocaleDateString()} ({b.payment_status})
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bill Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth  fullScreen={isMobile}>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent>
          {selectedBill && (
            <>
<h4>Charges Summary</h4>

{isMobile ? (
  // ---------- MOBILE: CARD VIEW ----------
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {(selectedBill.items || []).map((item, idx) => {
      const qty = Number(item?.quantity || 0);
      const unit = Number(item?.unit_price || 0);
      const sub = qty * unit;

      return (
        <div
          key={idx}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '10px 12px',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Item #{idx + 1}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              rowGap: 6,
              columnGap: 8,
              fontSize: '0.95rem',
            }}
          >
            <div style={{ color: '#666' }}>Description</div>
            <div>{item?.description || '—'}</div>

            <div style={{ color: '#666' }}>Type</div>
            <div>{item?.item_type || '—'}</div>

            <div style={{ color: '#666' }}>Qty</div>
            <div>{qty}</div>

            <div style={{ color: '#666' }}>Unit Price</div>
            <div>₹{unit.toFixed(2)}</div>

            <div style={{ color: '#666' }}>Subtotal</div>
            <div style={{ fontWeight: 600 }}>₹{sub.toFixed(2)}</div>
          </div>
        </div>
      );
    })}

    {/* Total Card */}
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '10px 12px',
        background: '#fafafa',
        marginTop: 6,
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 700,
      }}
    >
      <span>Total</span>
      <span>
        ₹
        {(selectedBill.items || [])
          .reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unit_price || 0), 0)
          .toFixed(2)}
      </span>
    </div>
  </div>
) : (
  // ---------- DESKTOP: TABLE VIEW ----------
  <div style={{ overflowX: 'auto' }}>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        minWidth: '600px',
      }}
    >
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
        {(selectedBill.items || []).map((item, idx) => {
          const qty = Number(item?.quantity || 0);
          const unit = Number(item?.unit_price || 0);
          const sub = qty * unit;

          return (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item?.description || '—'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {item?.item_type || '—'}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{qty}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                ₹{unit.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                ₹{sub.toFixed(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr style={{ fontWeight: 'bold' }}>
          <td
            colSpan={5}
            style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}
          >
            Total:
          </td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
            ₹
            {(selectedBill.items || [])
              .reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unit_price || 0), 0)
              .toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
)}




              <h4>Payment History</h4>
              {payments.length === 0 ? (
                <p>No payments for this bill.</p>
              ) : (
                payments.map(p => (
                  <div key={p._id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
                    <p><strong>Date:</strong> {new Date(p.payment_date).toLocaleString()}</p>
                    <p><strong>Amount:</strong> ₹{p.amount_paid}</p>
                    <p><strong>Method:</strong> {p.payment_method}</p>
                     <p>
  <strong>By:</strong>{" "}
  {p.received_by_user_id_ref 
    ? `${p.received_by_user_id_ref?.name} (${p.received_by_user_id_ref?.role})` 
    : "n/a"}
</p>
                  </div>
                ))
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {selectedPatient && bills.length === 0 && (
        <p style={{ marginTop: '1rem', color: '#d32f2f' }}>No bills for this patient.</p>
      )}

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
