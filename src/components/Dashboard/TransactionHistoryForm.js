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
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${BASE_URL}/api/inventory/items`, {
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
    const match = items.find(it => it.itemCode === selectedCode);
    setItemId(match?._id || null);
    setTransactions([]);
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
      const res = await fetch(`${BASE_URL}/api/inventory/transactions/${itemId}`, {
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
    <div className="txn-container">
      {/* Internal CSS */}
      <style>{`
        .txn-container {
          max-width: 1000px;
          margin: 1rem auto;
          padding: 1rem;
        }
        form {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        label {
          flex: 1;
          min-width: 200px;
        }
        select {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.25rem;
          font-size: 1rem;
        }
        button {
          padding: 0.6rem 1rem;
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          white-space: nowrap;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        /* Mobile responsive */
        @media (max-width: 768px) {
          form {
            flex-direction: column;
            align-items: stretch;
          }
          table, thead, tbody, th, td, tr {
            display: block;
          }
          thead {
            display: none;
          }
          tr {
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
            background: #fafafa;
          }
          td {
            border: none;
            display: flex;
            justify-content: space-between;
            padding: 6px 8px;
          }
          td::before {
            content: attr(data-label);
            font-weight: bold;
          }
        }
      `}</style>

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
        <button type="submit" disabled={!selectedCode || loadingItems}>
          Get Transactions
        </button>
      </form>

      {loadingItems && <p>Loading items…</p>}
      {loadingTxns && <p>Loading transactions…</p>}

      {transactions.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn._id}>
                  <td data-label="Date">{new Date(txn.createdAt).toLocaleString()}</td>
                  <td data-label="Type">{txn.transactionType}</td>
                  <td data-label="Quantity">{txn.quantity}</td>
                  <td data-label="Remarks">{txn.remarks || '-'}</td>
                  <td data-label="User">
                    {txn.userId?.name || 'Unknown'} ({txn.userId?.role || 'N/A'})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TransactionHistoryForm;
