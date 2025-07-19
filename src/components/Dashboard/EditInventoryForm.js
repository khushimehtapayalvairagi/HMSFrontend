import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

function EditInventoryForm({ onUpdated }) {
  const [form, setForm] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/api/inventory/items/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setForm(data.item))
      .catch(err => toast.error('Load failed: ' + err));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('supplierInfo.')) {
      setForm(prev => ({
        ...prev,
        supplierInfo: { ...prev.supplierInfo, [name.split('.')[1]]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/inventory/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          ...form,
          minStockLevel: Number(form.minStockLevel),
          maxStockLevel: Number(form.maxStockLevel),
          currentStock: Number(form.currentStock || 0)
        })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      toast.success(`Updated: ${data.item.itemName}`);
      onUpdated && onUpdated(data.item);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
        <label>
          Item Name:
          <input name="itemName" value={form.itemName} onChange={handleChange} required />
        </label>

        <label>
          Item Code:
          <input name="itemCode" value={form.itemCode} onChange={handleChange} disabled />
        </label>

        <label>
          Category:
          <input name="category" value={form.category} onChange={handleChange} />
        </label>

        

        <label>
          Min Stock Level:
          <input name="minStockLevel" type="number" value={form.minStockLevel} onChange={handleChange} />
        </label>

        <label>
          Max Stock Level:
          <input name="maxStockLevel" type="number" value={form.maxStockLevel} onChange={handleChange} />
        </label>

        <label>
          Supplier Name:
          <input name="supplierInfo.name" value={form.supplierInfo?.name || ''} onChange={handleChange} />
        </label>

        <label>
          Supplier Contact:
          <input name="supplierInfo.contact" value={form.supplierInfo?.contact || ''} onChange={handleChange} />
        </label>


        <button type="submit">Update Item</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default EditInventoryForm;
