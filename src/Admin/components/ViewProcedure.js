import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProcedure = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:8000/api/admin/procedures', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProcedures(response.data.procedures || []);
      } catch (err) {
        setError('Failed to load procedures');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Procedure List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : procedures.length === 0 ? (
        <p>No procedures found.</p>
      ) : (
        <div style={styles.cardGrid}>
          {procedures.map((procedure) => (
            <div key={procedure._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{procedure.name}</h3>
              <p><strong>Description:</strong> {procedure.description}</p>
              <p><strong>Cost:</strong> ₹{procedure.cost}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  cardTitle: {
    margin: '0 0 10px',
    fontSize: '20px',
    color: '#2c3e50'
  }
};

export default ViewProcedure;
