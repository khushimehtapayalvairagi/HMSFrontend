import React, { useState,useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './InventoryList.css'; // custom CSS

function InventoryList() {
  const [items, setItems] = useState([]);
  const [detailItem, setDetailItem] = useState(null);
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/inventory/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      toast.error("Failed to load inventory: " + err.message);
    }
  };
   useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="inventory-container">
      <ul className="inventory-list">
        {items.map(item => (
          <li key={item._id} className="inventory-item">
            <div className="item-info">
              <strong>{item.itemName}</strong> (Code: {item.itemCode}) – Stock: {item.currentStock}
            </div>
            <div className="item-actions">
            <button
  className="btn details-btn"
  onClick={() => {
    setDetailItem(item);
    localStorage.setItem('itemForTransaction', JSON.stringify({
      itemCode: item.itemCode,
      itemName: item.itemName
    }));
  }}
>
  Details
</button>

              <button
                className="btn edit-btn"
                onClick={() => navigate(`/inventoryManager-dashboard/inventory/edit/${item._id}`)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {detailItem && (
        <div className="details-panel">
          <h3>Details for {detailItem.itemName}</h3>
          <p><strong>Code:</strong> {detailItem.itemCode}</p>
          <p><strong>Category:</strong> {detailItem.category}</p>
          <p><strong>Supplier:</strong> {detailItem.supplierInfo?.name} – {detailItem.supplierInfo?.contact}</p>
          <p><strong>Current Stock:</strong> {detailItem.currentStock}</p>
          {/* add more fields as needed */}
          <button className="btn close-btn" onClick={() => setDetailItem(null)}>Close Details</button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default InventoryList;
