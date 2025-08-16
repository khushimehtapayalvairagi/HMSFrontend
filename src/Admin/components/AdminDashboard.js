import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on mobile
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [viewUserDropdownOpen, setViewUserDropdownOpen] = useState(false);
  const [labourRoomDropdownOpen, setLabourRoomDropdownOpen] = useState(false);
  const [roomCategoryDropdownOpen, setRoomCategoryDropdownOpen] = useState(false);
  const [wardDropdownOpen, setWardDropdownOpen] = useState(false);
  const [procedureDropdownOpen, setProcedureDropdownOpen] = useState(false);
  const [manualChargeDropdownOpen, setManualChargeDropdownOpen] = useState(false);
  const [referralDropdownOpen, setReferralDropdownOpen] = useState(false);
  const [operationDropdownOpen, setOperationDropdownOpen] = useState(false);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleLabel, setActiveModuleLabel] = useState('');
  const location = useLocation();

  // ✅ Close all dropdowns when navigating
  useEffect(() => {
    setUserMenuOpen(false);
    setViewUserDropdownOpen(false);
    setLabourRoomDropdownOpen(false);
    setRoomCategoryDropdownOpen(false);
    setWardDropdownOpen(false);
    setProcedureDropdownOpen(false);
    setManualChargeDropdownOpen(false);
    setReferralDropdownOpen(false);
    setOperationDropdownOpen(false);
    setSpecialtyDropdownOpen(false);
    setDepartmentDropdownOpen(false);
    setReportDropdownOpen(false);

    // auto close sidebar on mobile when navigating
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  // ✅ Auto open Reports dropdown if inside reports section
  useEffect(() => {
    if (location.pathname.startsWith('/reports')) {
      setActiveModuleLabel('Reports');
      setReportDropdownOpen(true);
    }
  }, [location.pathname]);

  const modules = [
    {
      label: 'Reports',
      icon: '📊',
      dropdownOpen: reportDropdownOpen,
      setDropdownOpen: setReportDropdownOpen,
      content: (
        <>
          <Link to="reports/opd-register" style={dropdownLinkStyle}>Central OPD Register</Link>
          <Link to="reports/ipd-register" style={dropdownLinkStyle}>Central IPD Register</Link>
        </>
      )
    },
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
      setDropdownOpen: setManualChargeDropdownOpen,
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
      {/* ✅ Fixed Navbar */}
      <div style={styles.navbar}>
        <button style={styles.menuButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✖' : '☰'}
        </button>
        <h5>Hospital Management System</h5>
    <Box sx={styles.logoutIconDesktop}>
    <IconButton
      color="inherit"
      onClick={() => {
        localStorage.removeItem("jwt");
        window.location.href = "/";
      }}
      edge="end"
      title="Logout"
    >
      <LogoutIcon />
    </IconButton>
  </Box>
      </div>

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div>
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

            {modules
              .filter(mod => mod.label.toLowerCase().includes(searchTerm))
              .map((mod, index) => (
                <div key={index} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <button
                      onClick={() => {
                        const isOpening = !mod.dropdownOpen;
                        modules.forEach(m => m.setDropdownOpen(false));
                        mod.setDropdownOpen(isOpening);
                        setActiveModuleLabel(isOpening ? mod.label : '');
                      }}
                      style={{
                        ...(activeModuleLabel === mod.label ? activeLinkStyle : linkStyle),
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{mod.icon} {mod.label}</span>
                      <span>{mod.dropdownOpen ? '▲' : '▼'}</span>
                    </button>
                  </div>

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

      
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

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
    overflow: 'hidden'
  },
   logoutIconDesktop: {
    marginLeft: "auto",
    display: "flex" , // hide on small, show on medium+
    alignItems: "center",
  },
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '50px',
    backgroundColor: '#0284c7',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    zIndex: 1001,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  menuButton: {
    marginRight: '15px',
    fontSize: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  sidebar: {
    width: '260px',
    color: '#111827',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 6px rgba(0,0,0,0.05)',
    padding: '20px 15px',
    backgroundColor: '#ffffff',
    height: '100vh',
    overflowY: 'auto',
    marginTop: '50px',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
  },
  overlay: {
    position: 'fixed',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  hr: {
    border: 'none',
    borderBottom: '1px solid #d1d5db',
    margin: '10px 0',
    width: '100%',
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    marginTop: '6px',
    padding: '8px 0px 8px 12px',
    marginLeft: '6px',
    borderLeft: '3px solid #0284c7',
    width: 'calc(100% - 10px)',
  },
  nestedDropdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '4px',
    paddingLeft: '16px',
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
    alignSelf: 'right',
  },
  main: {
    flex: 1,
    padding: '70px 15px 30px 15px',
    background: '#f3f4f6',
    overflowY: 'auto',
    height: '100vh',
    marginLeft: '0px',
  },
};

const linkStyle = {
  padding: '10px 16px',
  textDecoration: 'none',
  color: '#1f2937',
  fontWeight: '600',
  width: '100%',
  textAlign: 'left',
  transition: 'background 0.2s ease',
  borderRadius: '6px',
  marginBottom: '1px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#e0f2fe',
  color: '#0284c7',
  fontWeight: '700',
};

const dropdownLinkStyle = {
  ...linkStyle,
  fontSize: '14px',
  padding: '8px 12px',
  marginLeft: '0px',
  marginBottom: '4px',
  fontWeight: '500',
  backgroundColor: 'transparent',
};

export default AdminDashboard;
