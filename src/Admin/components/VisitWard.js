import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VisitWard = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get('http://localhost:8000/api/admin/wards', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setWards(res.data.wards || []);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Ward List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead style={{ backgroundColor: '#f4f4f4' }}>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Room Category</th>
                <th style={styles.th}>Beds</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((ward) => (
                <tr key={ward._id}>
                  <td style={styles.td}>{ward.name}</td>
                  <td style={styles.td}>{ward.roomCategory?.name || 'N/A'}</td>
                  <td style={styles.td}>
                    <ul style={{ paddingLeft: '20px' }}>
                      {ward.beds.map((bed, index) => (
                        <li key={index}>
                          Bed {bed.bedNumber} - {bed.status}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid black',
    borderRight: '1px solid black'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    verticalAlign: 'top',
    backgroundColor: '#f9f9f9'
  }
};


export default VisitWard;
