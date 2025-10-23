import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecordTransactionForm = ({ userId: propUserId, onSuccess }) => {
  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState('');
  const [itemId, setItemId] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [userId, setUserId] = useState(propUserId);
  const [form, setForm] = useState({
    transactionType: '',
    quantity: '',
    remarks: ''
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${BASE_URL}/api/inventory/items`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 404) {
            setItems([]);
            return;
          }
          throw new Error(await res.text());
        }

        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        toast.error('Failed loading items: ' + err.message);
      }
    };

    loadItems();

    const storedItem = JSON.parse(localStorage.getItem('itemForTransaction'));
    if (storedItem?.itemCode) setItemCode(storedItem.itemCode);

    if (!propUserId) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.userId) setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    const match = items.find(it => it.itemCode === itemCode);
    setItemId(match?._id || null);
  }, [itemCode, items]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { transactionType, quantity, remarks } = form;

    if (!transactionType || !quantity || !itemId || !userId) {
      toast.error("All fields except remarks are required.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/inventory/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          itemId,
          userId,
          transactionType,
          quantity: Number(quantity),
          remarks
        })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      toast.success(`Transaction recorded: ${data.transaction.transactionType} ${data.transaction.quantity}`);
      setForm({ transactionType: '', quantity: '', remarks: '' });
      onSuccess && onSuccess(data.transaction);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ Internal CSS
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '40px auto',
      padding: '25px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    },
    label: {
      fontWeight: 600,
      color: '#333',
      fontSize: '14px'
    },
    input: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    select: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '14px'
    },
    button: {
      marginTop: '10px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#1976d2',
      color: 'white',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'background 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '15px' }}>
        Record Inventory Transaction
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Select Item Code:
          <select
            value={itemCode}
            onChange={e => setItemCode(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">-- Select Code --</option>
            {items.map(it => (
              <option key={it._id} value={it.itemCode}>
                {it.itemCode} – {it.itemName}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Transaction Type:
          <select
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select Type*</option>
            <option value="In">Stock In</option>
            <option value="Out">Stock Out</option>
          </select>
        </label>

        <label style={styles.label}>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter Quantity"
            required
            min="1"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Remarks (optional):
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            style={styles.input}
          />
        </label>

        <button
          type="submit"
          style={styles.button}
          onMouseOver={e => (e.target.style.backgroundColor = '#125ca1')}
          onMouseOut={e => (e.target.style.backgroundColor = '#1976d2')}
        >
          Record Transaction
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RecordTransactionForm;
