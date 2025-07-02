import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [viewUserDropdownOpen, setViewUserDropdownOpen] = useState(false);
  const [labourRoomDropdownOpen, setLabourRoomDropdownOpen] = useState(false);
 const [roomCategoryDropdownOpen,setRoomCategoryDropdownOpen] = useState(false)
 const [wardDropdownOpen,setWardDropdownOpen]=useState(false)
  const [procedureDropdownOpen,setProcedureDropdownOpen]=useState(false)
 const [manualChargeDropdownOpen,setManualChargeDrodownOpen]=useState(false);
  const [referralDropdownOpen,setReferralDropdownOpen] = useState(false);
  const [operationDropdownOpen,setOperationDropdownOpen] = useState(false);
  const [specialtyDropdownOpen,setSpecialtyDropdownOpen] = useState(false);
  const [departmentDropdownOpen,setDepartmentDropdownOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [activeModuleLabel, setActiveModuleLabel] = useState('');

  const location = useLocation();

  // Close all dropdowns when navigating
  useEffect(() => {
    setUserMenuOpen(false);
    setViewUserDropdownOpen(false);
      setLabourRoomDropdownOpen(false);
      setRoomCategoryDropdownOpen(false);
      setWardDropdownOpen(false)
      setProcedureDropdownOpen(false)
      setManualChargeDrodownOpen(false);
      setReferralDropdownOpen(false);
      setOperationDropdownOpen(false)
      setSpecialtyDropdownOpen(false)
      setDepartmentDropdownOpen(false)
  }, [location.pathname]);
const modules = [
  {
    label: 'User Management',
    icon: '👥',
    dropdownOpen: userMenuOpen,
    setDropdownOpen: setUserMenuOpen,
    content: (
      <>
        <Link to="add-user" style={dropdownLinkStyle}>➕ Add User</Link>
        <button
          onClick={() => setViewUserDropdownOpen(prev => !prev)}
          style={{
            ...dropdownLinkStyle,
            background: 'white',
            border: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          📋 View Users <span>{viewUserDropdownOpen ? '▲' : '▼'}</span>
        </button>
        {viewUserDropdownOpen && (
          <div style={styles.nestedDropdown}>
            <Link to="view-user/doctor" style={dropdownLinkStyle}>👨‍⚕️ Doctor</Link>
            <Link to="view-user/staff" style={dropdownLinkStyle}>👩‍💼 Staff</Link>
          </div>
        )}
      </>
    )
  },
  {
    label: 'Specialty',
    icon: '🏥',
    dropdownOpen: specialtyDropdownOpen,
    setDropdownOpen: setSpecialtyDropdownOpen,
    content: (
      <>
        <Link to="specialty" style={dropdownLinkStyle}>➕ Add Specialty</Link>
        <Link to="viewSpecialty" style={dropdownLinkStyle}>👀 View Specialty</Link>
      </>
    )
  },
  {
    label: 'Department',
    icon: '🏥',
    dropdownOpen: departmentDropdownOpen,
    setDropdownOpen: setDepartmentDropdownOpen,
    content: (
      <>
        <Link to="department" style={dropdownLinkStyle}>➕ Add Department</Link>
        <Link to="viewDepartment" style={dropdownLinkStyle}>👀 View Department</Link>
      </>
    )
  },
  {
    label: 'Labour Room',
    icon: '🏥',
    dropdownOpen: labourRoomDropdownOpen,
    setDropdownOpen: setLabourRoomDropdownOpen,
    content: (
      <>
        <Link to="labourRoom" style={dropdownLinkStyle}>➕ Add Labour Room</Link>
        <Link to="visit-room" style={dropdownLinkStyle}>👀 Visit Room</Link>
      </>
    )
  },
  {
    label: 'Room Category',
    icon: '🏥',
    dropdownOpen: roomCategoryDropdownOpen,
    setDropdownOpen: setRoomCategoryDropdownOpen,
    content: (
      <>
        <Link to="Room-Category" style={dropdownLinkStyle}>➕ Add Room</Link>
        <Link to="visitRoom" style={dropdownLinkStyle}>👀 Visit Room</Link>
      </>
    )
  },
  {
    label: 'Ward',
    icon: '🏥',
    dropdownOpen: wardDropdownOpen,
    setDropdownOpen: setWardDropdownOpen,
    content: (
      <>
        <Link to="ward" style={dropdownLinkStyle}>➕ Add Ward</Link>
        <Link to="visitWard" style={dropdownLinkStyle}>👀 Visit Ward</Link>
      </>
    )
  },
  {
    label: 'Procedure',
    icon: '🏥',
    dropdownOpen: procedureDropdownOpen,
    setDropdownOpen: setProcedureDropdownOpen,
    content: (
      <>
        <Link to="procedure" style={dropdownLinkStyle}>➕ Add Procedure</Link>
        <Link to="view-procedure" style={dropdownLinkStyle}>👀 View Procedure</Link>
      </>
    )
  },
  {
    label: 'ManualCharge',
    icon: '🏥',
    dropdownOpen: manualChargeDropdownOpen,
    setDropdownOpen: setManualChargeDrodownOpen,
    content: (
      <>
        <Link to="manualCharge" style={dropdownLinkStyle}>➕ Add ManualCharge</Link>
        <Link to="view-manualCharge" style={dropdownLinkStyle}>👀 View ManualCharge</Link>
      </>
    )
  },
  {
    label: 'Referral Partner',
    icon: '🏥',
    dropdownOpen: referralDropdownOpen,
    setDropdownOpen: setReferralDropdownOpen,
    content: (
      <>
        <Link to="partner" style={dropdownLinkStyle}>➕ Add ReferralPartner</Link>
        <Link to="view-partners" style={dropdownLinkStyle}>👀 View ReferralPartner</Link>
      </>
    )
  },
  {
    label: 'Operation Theatre',
    icon: '🏥',
    dropdownOpen: operationDropdownOpen,
    setDropdownOpen: setOperationDropdownOpen,
    content: (
      <>
        <Link to="operation-theatre" style={dropdownLinkStyle}>➕ Add OperationTheatre</Link>
        <Link to="view-operation-theatre" style={dropdownLinkStyle}>👀 View OperationTheatre</Link>
      </>
    )
  },
];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div>
        <h2 style={styles.title}>Admin Dashboard</h2>

        <nav style={styles.nav}>
       <Link
  to=""
  onClick={() => setActiveModuleLabel('')}
  style={activeModuleLabel === '' ? activeLinkStyle : linkStyle}
>
  🏠 Home
</Link>

<hr style={styles.hr} />

<input
  type="text"
  placeholder="🔍 Search modules..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
  style={{
    width: '90%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    marginBottom: '10px',
    fontSize: '14px'
  }}
/>

          {/* User Management Dropdown Toggle */}
     {modules
    .filter(mod => mod.label.toLowerCase().includes(searchTerm))
    .map((mod, index) => (
      <div key={index}>
       <button
  onClick={() => {
    const isOpening = !mod.dropdownOpen;

    // Close all dropdowns
    modules.forEach(m => m.setDropdownOpen(false));

    // Open only the clicked one
    mod.setDropdownOpen(isOpening);

    // Highlight only the active one
    setActiveModuleLabel(isOpening ? mod.label : '');
  }}
  style={{
    ...(activeModuleLabel === mod.label ? activeLinkStyle : linkStyle),
    background: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100vh',
    cursor: 'pointer',
  }}
>
  {mod.icon} {mod.label} <span>{mod.dropdownOpen ? '▲' : '▼'}</span>
</button>


        {mod.dropdownOpen && (
          <div style={styles.dropdown}>
            {mod.content}
          </div>
        )}
        <hr style={styles.hr} />
      </div>
  ))}
        </nav>
        </div>
          <button
    onClick={() => {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }}
    style={styles.logoutButton}
  >
    🔒 Logout
  </button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
};

// === Styles ===
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    flexDirection: 'row',
  },
  sidebar: {
    width: '260px',
  
    color: '#111827',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 6px rgba(0,0,0,0.05)',
    padding: '20px 15px',
    height:"130vh"
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0284c7',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // 🔥 aligns all to the left
    width: '100%',
  },
  hr: {
    border: 'none',
    borderBottom: '1px solid #d1d5db',
    margin: '10px 0',
    width: '300%',
  },
dropdown: {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: '#f3f4f6',  // Light gray background
  borderRadius: '4px',
  marginTop: '6px',
  padding: '4px 0px 4px 16px', // Top-right-bottom-left padding
  marginLeft: '10px',           // Align just under the module
  borderLeft: '3px solid #0284c7',
  width: 'calc(100% - 10px)',   // Slightly reduced width to match indent
},
nestedDropdown: {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginTop: '4px',
  paddingLeft: '24px',         // Not too deep
  width: '100%',
},

  logoutButton: {
    marginTop: 'auto',
    padding: '10px 15px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '90%',
    transition: 'background-color 0.3s ease',
    alignSelf: 'center',
  },
  main: {
    flex: 1,
    padding: '30px',
    background: '#f3f4f6',
    overflowY: 'auto',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
      height:"180vh"
  },
};


const linkStyle = {
  padding: '10px 16px',
  textDecoration: 'none',
  color: '#1f2937', // Tailwind gray-800
  fontWeight: '600',
  width: '100%',
  textAlign: 'left',
  transition: 'background 0.2s ease',
  borderRadius: '6px',
  marginBottom: '6px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};
const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#e0f2fe', // Light blue background
  color: '#0284c7',           // Blue text
  fontWeight: '700',
};


const dropdownLinkStyle = {
  ...linkStyle,
  fontSize: '14px',
  padding: '8px 20px',
    marginLeft: '0px',
  marginBottom: '4px',
  fontWeight: '500',
  
};

export default AdminDashboard;
