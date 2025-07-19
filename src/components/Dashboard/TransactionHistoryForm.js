import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionHistoryForm = () => {
  const [items, setItems] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [itemId, setItemId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingTxns, setLoadingTxns] = useState(false);

  useEffect(() => {
    // fetch all inventory items—which you already have an endpoint for
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
      } finally {
        setLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    // whenever selectedCode changes, find matching itemId
    const match = items.find(it => it.itemCode === selectedCode);
    setItemId(match?._id || null);
    setTransactions([]); // reset old
  }, [selectedCode, items]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!itemId) {
      toast.error('Please select a valid item by code.');
      return;
    }
    try {
      setLoadingTxns(true);
      const token = localStorage.getItem('jwt');
      const res = await fetch(`http://localhost:8000/api/inventory/transactions/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTransactions(data.transactions || []);
      toast.success(`${data.transactions.length} record(s) found`);
    } catch (err) {
      toast.error('Fetch failed: ' + err.message);
    } finally {
      setLoadingTxns(false);
    }
  };

  return (
    <div>
      <h3>Fetch Transaction History by Item Code</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Select Item Code:
          <select
            value={selectedCode}
            onChange={e => setSelectedCode(e.target.value)}
            disabled={loadingItems}
            required
          >
            <option value="">-- choose code --</option>
            {items.map(it => (
              <option key={it._id} value={it.itemCode}>
                {it.itemCode} – {it.itemName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={!selectedCode || loadingItems}>Get Transactions</button>
      </form>

      {loadingItems && <p>Loading items…</p>}
      {loadingTxns && <p>Loading transactions…</p>}

      {transactions.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>Quantity</th><th>Remarks</th><th>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn._id}>
                <td>{new Date(txn.createdAt).toLocaleString()}</td>
                <td>{txn.transactionType}</td>
                <td>{txn.quantity}</td>
                <td>{txn.remarks || '-'}</td>
                <td>{txn.userId?.name || 'Unknown'} ({txn.userId?.role || 'N/A'})</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TransactionHistoryForm;
