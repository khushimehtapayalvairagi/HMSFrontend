import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function EditInventoryForm({ onUpdated }) {
  const [form, setForm] = useState(null);
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/inventory/items/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data) => setForm(data.item))
      .catch((err) => toast.error('Load failed: ' + err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('supplierInfo.')) {
      setForm((prev) => ({
        ...prev,
        supplierInfo: { ...prev.supplierInfo, [name.split('.')[1]]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/inventory/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({
          ...form,
          minStockLevel: Number(form.minStockLevel),
          maxStockLevel: Number(form.maxStockLevel),
          currentStock: Number(form.currentStock || 0),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      toast.success(`Updated: ${data.item.itemName}`);
      onUpdated && onUpdated(data.item);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!form) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  // ✅ Internal CSS
  const styles = {
    container: {
      maxWidth: '550px',
      margin: '50px auto',
      backgroundColor: '#f9fafc',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif',
    },
    heading: {
      textAlign: 'center',
      fontSize: '1.6rem',
      fontWeight: '600',
      color: '#2a3f54',
      marginBottom: '25px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    label: {
      display: 'flex',
      flexDirection: 'column',
      fontWeight: '500',
      color: '#333',
      fontSize: '14px',
    },
    input: {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      outline: 'none',
      marginTop: '5px',
      transition: 'border-color 0.3s ease',
    },
    inputDisabled: {
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '15px',
      backgroundColor: '#f1f1f1',
      cursor: 'not-allowed',
      marginTop: '5px',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>Edit Inventory Item</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Item Name:
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Item Code:
            <input
              name="itemCode"
              value={form.itemCode}
              onChange={handleChange}
              disabled
              style={styles.inputDisabled}
            />
          </label>

          <label style={styles.label}>
            Category:
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Min Stock Level:
            <input
              name="minStockLevel"
              type="number"
              value={form.minStockLevel}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Max Stock Level:
            <input
              name="maxStockLevel"
              type="number"
              value={form.maxStockLevel}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Supplier Name:
            <input
              name="supplierInfo.name"
              value={form.supplierInfo?.name || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Supplier Contact:
            <input
              name="supplierInfo.contact"
              value={form.supplierInfo?.contact || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </label>

          <button type="submit" style={styles.button}>
            Update Item
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default EditInventoryForm;
