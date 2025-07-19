import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InventoryForm() {
  const [form, setForm] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    unitOfMeasurement: '',
    minStockLevel: '',
    maxStockLevel: '',
    supplierInfo: { name: '', contact: '' },
    currentStock: '',
  });

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

  const validateForm = () => {
    if (!form.itemName || !form.itemCode || !form.category ||
        !form.unitOfMeasurement || form.minStockLevel === '' ||
        form.maxStockLevel === '' ||
        !form.supplierInfo.name || !form.supplierInfo.contact) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    const contact = form.supplierInfo.contact;
    if (!/^\d{10}$/.test(contact)) {
      toast.error("Supplier contact must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('jwt');
    const body = {
      ...form,
      minStockLevel: Number(form.minStockLevel),
      maxStockLevel: Number(form.maxStockLevel),
      currentStock: form.currentStock ? Number(form.currentStock) : undefined,
    };

    try {
      const res = await fetch('http://localhost:8000/api/inventory/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      toast.success(`Item created: ${data.item.itemName}`);
      setForm({
        itemName: '',
        itemCode: '',
        category: '',
        unitOfMeasurement: '',
        minStockLevel: '',
        maxStockLevel: '',
        supplierInfo: { name: '', contact: '' },
        currentStock: '',
      });
    } catch (err) {
    if (err.message.includes('duplicate key')) {
  toast.error("Item code already exists. Please use a different code.");
}
    }


  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="itemName" value={form.itemName} onChange={handleChange} placeholder="Item Name*" required />
        <input name="itemCode" value={form.itemCode} onChange={handleChange} placeholder="Item Code*" required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Category*</option>
          <option value="Surgical Consumable">Surgical Consumable</option>
          <option value="Equipment">Equipment</option>
          <option value="Office Supplies">Office Supplies</option>
        </select>
        <input name="unitOfMeasurement" value={form.unitOfMeasurement} onChange={handleChange} placeholder="Unit of Measurement*" required />
        <input name="minStockLevel" type="number" value={form.minStockLevel} onChange={handleChange} placeholder="Min Stock Level*" required />
        <input name="maxStockLevel" type="number" value={form.maxStockLevel} onChange={handleChange} placeholder="Max Stock Level*" required />

        <input name="supplierInfo.name" value={form.supplierInfo.name} onChange={handleChange} placeholder="Supplier Name*" required />
        <input name="supplierInfo.contact" value={form.supplierInfo.contact} onChange={handleChange} placeholder="Supplier Contact (10 digits)*" required />

        <input name="currentStock" type="number" value={form.currentStock} onChange={handleChange} placeholder="Current Stock" />
        <button type="submit">Create Item</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default InventoryForm;
