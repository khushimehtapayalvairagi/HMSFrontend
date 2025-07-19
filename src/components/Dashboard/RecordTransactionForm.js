import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecordTransactionForm = ({ userId: propUserId, onSuccess }) => {
  const [items, setItems] = useState([]);
  const [itemCode, setItemCode] = useState('');
  const [itemId, setItemId] = useState(null);
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
        const res = await fetch('http://localhost:8000/api/inventory/items', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(data.items || []);
      } catch (err) {
        toast.error('Failed loading items: ' + err.message);
      }
    };
    loadItems();

    const storedItem = JSON.parse(localStorage.getItem('itemForTransaction'));
    if (storedItem?.itemCode) {
      setItemCode(storedItem.itemCode);
    }

    if (!propUserId) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) setUserId(user.id);
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
      const res = await fetch('http://localhost:8000/api/inventory/transactions', {
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Select Item Code:
          <select value={itemCode} onChange={e => setItemCode(e.target.value)} required>
            <option value="">-- Select Code --</option>
            {items.map(it => (
              <option key={it._id} value={it.itemCode}>
                {it.itemCode} – {it.itemName}
              </option>
            ))}
          </select>
        </label>

        <select name="transactionType" value={form.transactionType} onChange={handleChange} required>
          <option value="">Transaction Type*</option>
          <option value="In">Stock In</option>
          <option value="Out">Stock Out</option>
        </select>

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity*"
          required
          min="1"
        />

        <input
          type="text"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Remarks (optional)"
        />

        <button type="submit">Record Transaction</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default RecordTransactionForm;
