import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PaymentForm({ onPaymentSuccess }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [bill, setBill] = useState(null);
  const [form, setForm] = useState({ amount: '', method: 'Cash', externalRef: '' });
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAdmittedPatients = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/receptionist/patients', { headers });
        const allPatients = res.data.patients;
        const admittedPatients = [];

        for (const patient of allPatients) {
          const ipd = await axios.get(`http://localhost:8000/api/ipd/admissions/${patient._id}`, { headers });
          const admissions = ipd.data.admissions || [];
          if (admissions.some(adm => adm.status === 'Admitted')) {
            admittedPatients.push(patient);
          }
        }

        setPatients(admittedPatients);
      } catch {
        toast.error('Failed to load admitted patients');
      }
    };

    fetchAdmittedPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setBill(null);
      setPayments([]);
      return;
    }

    axios.get(`http://localhost:8000/api/billing/bills/patient/${selectedPatient}`, { headers })
      .then(res => {
        const pending = res.data.bills.filter(b => b.payment_status === 'Pending');
        const first = pending[0] ?? null;
        setBill(first);
        if (!first) {
          setForm({ amount: '', method: 'Cash', externalRef: '' });
          setPayments([]);
        }
      })
      .catch(() => setError('Failed to fetch bill'));
  }, [selectedPatient]);

  useEffect(() => {
    if (bill?.balance_due != null) {
      setForm(prev => ({ ...prev, amount: bill.balance_due.toString() }));
      fetchPayments();
    }
  }, [bill]);

  const fetchPayments = () => {
    axios.get(`http://localhost:8000/api/billing/payments/${bill._id}`, { headers })
      .then(res => setPayments(res.data.payments))
      .catch(() => console.error('Failed to load payments'));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPayment = async e => {
    e.preventDefault();
    setError('');
    const amt = Number(form.amount);
    if (!(amt > 0)) return setError('Enter a valid amount');
    if (amt > bill.balance_due) return setError(`Cannot exceed balance due (₹${bill.balance_due})`);
    if (form.method === 'External_Reference' && !form.externalRef.trim()) {
      return setError('External reference required');
    }

    try {
      const payload = {
        bill_id_ref: bill._id,
        amount_paid: amt,
        payment_method: form.method,
        external_reference_number: form.externalRef || undefined,
        received_by_user_id_ref: JSON.parse(localStorage.user).id
      };

      const { data } = await axios.post('http://localhost:8000/api/billing/payments', payload, { headers });
      setBill(data.updatedBill);
      onPaymentSuccess?.(data.updatedBill, data.payment);
      fetchPayments();
          toast.success('Payment recorded successfully ✅');

    } catch (err) {
      setError(err.response?.data?.message || 'Payment error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Make Payment</h2>

      <div style={styles.field}>
        <label>Patient:</label>
        <select style={styles.select} value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          <option value="">-- Select Patient --</option>
          {patients.map(p => (
            <option key={p._id} value={p._id}>{p.fullName}</option>
          ))}
        </select>
      </div>

      {bill && (
        <div style={styles.section}>

          <h4 style={{ marginTop: '1.5rem' }}>Charges Summary</h4>
        <div style={styles.tableWrapper}>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>#</th>
        <th style={styles.th}>Description</th>
        <th style={styles.th}>Type</th>
        <th style={styles.th}>Qty</th>
        <th style={styles.th}>Unit Price</th>
        <th style={styles.th}>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {bill.items?.map((item, idx) => (
        <tr key={idx}>
          <td style={styles.td}>{idx + 1}</td>
          <td style={styles.td}>{item.description || '—'}</td>
          <td style={styles.td}>{item.item_type || '—'}</td>
          <td style={styles.td}>{item.quantity}</td>
          <td style={styles.td}>₹{item.unit_price}</td>
          <td style={styles.td}>₹{(item.quantity * item.unit_price).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="5" style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
        <td style={{ ...styles.td, fontWeight: 'bold' }}>
          ₹{bill.items?.reduce((sum, i) => sum + i.quantity * i.unit_price, 0).toFixed(2)}
        </td>
      </tr>
    </tfoot>
  </table>
</div>

   <p><strong>Balance Due:</strong> ₹{bill.balance_due}</p>
          <form onSubmit={submitPayment} style={styles.form}>
            <h3>Record Payment</h3>

            <div style={styles.field}>
              <label>Amount:</label>
              <input
                style={styles.input}
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <label>Method:</label>
              <select style={styles.select} name="method" value={form.method} onChange={handleChange}>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="External_Reference">External Reference</option>
              </select>
            </div>

            {form.method === 'External_Reference' && (
              <div style={styles.field}>
                <label>External Ref #:</label>
                <input
                  style={styles.input}
                  name="externalRef"
                  value={form.externalRef}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button style={styles.button} type="submit">Submit Payment</button>
            {error && <p style={styles.error}>{error}</p>}
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h3>Payment History:</h3>
            {payments.length === 0 ? (
              <p>No payments yet</p>
            ) : (
              payments.map(p => (
                <div key={p._id} style={styles.paymentCard}>
                  <p><strong>Date:</strong> {new Date(p.payment_date).toLocaleString()}</p>
                  <p><strong>Amt:</strong> ₹{p.amount_paid}</p>
                  <p><strong>Method:</strong> {p.payment_method}</p>
                  <p><strong>By:</strong> {p.received_by_user_id_ref.name} ({p.received_by_user_id_ref.role})</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedPatient && !bill && <p style={styles.info}>No pending bills for this patient.</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)'
  },
  heading: {
    textAlign: 'center',
    color: '#333'
  },
  section: {
    marginTop: '1.5rem'
  },
 tableWrapper: {
  overflowX: 'auto',
  marginTop: '1rem',
  borderRadius: '8px',
  border: '1px solid #dee2e6',
  backgroundColor: '#fff',
},

table: {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.95rem',
},

th: {
  padding: '12px 10px',
  backgroundColor: '#f1f3f5',
  borderBottom: '1px solid #dee2e6',
  textAlign: 'left',
  fontWeight: '600',
  color: '#333',
},

td: {
  padding: '10px',
  borderBottom: '1px solid #dee2e6',
  color: '#444',
},

tfoot: {
  backgroundColor: '#f8f9fa',
  fontWeight: 'bold'
},

  field: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  form: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    boxShadow: '0 0 5px rgba(0,0,0,0.05)',
    marginTop: '1rem'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    marginTop: '1rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '0.5rem'
  },
  paymentCard: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    boxShadow: '0 0 6px rgba(0,0,0,0.05)'
  },
  info: {
    color: '#555',
    fontStyle: 'italic',
    marginTop: '1rem'
  }
};
