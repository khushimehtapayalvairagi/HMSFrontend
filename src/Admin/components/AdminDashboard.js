import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Logout as LogoutIcon, ExpandMore, AssignmentInd } from '@mui/icons-material';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Sidebar + dropdown states
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Navbar menu anchors
  const [roleAnchor, setRoleAnchor] = useState(null);
  const [staffAnchor, setStaffAnchor] = useState(null);
  const [receptionistAnchor, setReceptionistAnchor] = useState(null);
  const [nurseAnchor, setNurseAnchor] = useState(null);
  const [labAnchor, setLabAnchor] = useState(null);
  const [inventoryAnchor, setInventoryAnchor] = useState(null);
  const [doctorAnchor, setDoctorAnchor] = useState(null);

  const location = useLocation();

  // Open/close handlers for nav menus
  const openRoleMenu = (e) => setRoleAnchor(e.currentTarget);
  const closeRoleMenu = () => setRoleAnchor(null);

  const openStaffMenu = (e) => setStaffAnchor(e.currentTarget);
  const closeStaffMenu = () => setStaffAnchor(null);

  const openReceptionistMenu = (e) => setReceptionistAnchor(e.currentTarget);
  const closeReceptionistMenu = () => setReceptionistAnchor(null);

  const openNurseMenu = (e) => setNurseAnchor(e.currentTarget);
  const closeNurseMenu = () => setNurseAnchor(null);

  const openLabMenu = (e) => setLabAnchor(e.currentTarget);
  const closeLabMenu = () => setLabAnchor(null);

  const openInventoryMenu = (e) => setInventoryAnchor(e.currentTarget);
  const closeInventoryMenu = () => setInventoryAnchor(null);

  const openDoctorMenu = (e) => setDoctorAnchor(e.currentTarget);
  const closeDoctorMenu = () => setDoctorAnchor(null);

  // Auto close dropdowns on navigation
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

    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/reports')) {
      setActiveModuleLabel('Reports');
      setReportDropdownOpen(true);
    }
  }, [location.pathname]);

  // Sidebar modules
  const modules = [
    {
      label: 'Reports',
      icon: '📊',
      dropdownOpen: reportDropdownOpen,
      setDropdownOpen: setReportDropdownOpen,
      content: (
        <>
          <Link to="reports/opd-register" style={dropdownLinkStyle}>
            Central OPD Register
          </Link>
          {/* <Link to="reports/ipd-register" style={dropdownLinkStyle}>
            Central IPD Register
          </Link> */}
        </>
      ),
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
            onClick={() => setViewUserDropdownOpen((prev) => !prev)}
            style={{
              ...dropdownLinkStyle,
              background: 'white',
              border: 'none',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
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
      ),
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
      ),
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
      ),
    },
    {
      label: 'Labour Room',
      icon: '👶',
      dropdownOpen: labourRoomDropdownOpen,
      setDropdownOpen: setLabourRoomDropdownOpen,
      content: (
        <>
          <Link to="labourRoom" style={dropdownLinkStyle}>➕ Add Labour Room</Link>
          <Link to="visit-room" style={dropdownLinkStyle}>👀 Visit Room</Link>
        </>
      ),
    },
    {
      label: 'Room Category',
      icon: '🛏️',
      dropdownOpen: roomCategoryDropdownOpen,
      setDropdownOpen: setRoomCategoryDropdownOpen,
      content: (
        <>
          <Link to="Room-Category" style={dropdownLinkStyle}>➕ Add Room</Link>
          <Link to="visitRoom" style={dropdownLinkStyle}>👀 Visit Room</Link>
        </>
      ),
    },
    {
      label: 'Ward',
      icon: '🚪',
      dropdownOpen: wardDropdownOpen,
      setDropdownOpen: setWardDropdownOpen,
      content: (
        <>
          <Link to="ward" style={dropdownLinkStyle}>➕ Add Ward</Link>
          <Link to="visitWard" style={dropdownLinkStyle}>👀 View Ward</Link>
        </>
      ),
    },
    {
      label: 'Procedure',
      icon: '🧪',
      dropdownOpen: procedureDropdownOpen,
      setDropdownOpen: setProcedureDropdownOpen,
      content: (
        <>
          <Link to="procedure" style={dropdownLinkStyle}>➕ Add Procedure</Link>
          <Link to="view-procedure" style={dropdownLinkStyle}>👀 View Procedure</Link>
        </>
      ),
    },
    {
      label: 'Manual Charge',
      icon: '💵',
      dropdownOpen: manualChargeDropdownOpen,
      setDropdownOpen: setManualChargeDropdownOpen,
      content: (
        <>
          <Link to="manualCharge" style={dropdownLinkStyle}>➕ Add Manual Charge</Link>
          <Link to="view-manualCharge" style={dropdownLinkStyle}>👀 View Manual Charge</Link>
        </>
      ),
    },
    {
      label: 'Referral Partner',
      icon: '🤝',
      dropdownOpen: referralDropdownOpen,
      setDropdownOpen: setReferralDropdownOpen,
      content: (
        <>
          <Link to="partner" style={dropdownLinkStyle}>➕ Add Referral Partner</Link>
          <Link to="view-partners" style={dropdownLinkStyle}>👀 View Referral Partner</Link>
        </>
      ),
    },
    {
      label: 'Operation Theatre',
      icon: '🩺',
      dropdownOpen: operationDropdownOpen,
      setDropdownOpen: setOperationDropdownOpen,
      content: (
        <>
          <Link to="operation-theatre" style={dropdownLinkStyle}>➕ Add Operation Theatre</Link>
          <Link to="view-operation-theatre" style={dropdownLinkStyle}>👀 View Operation Theatre</Link>
        </>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      {/* === Navbar === */}
      <div style={styles.navbar}>
        <button style={styles.menuButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✖' : '☰'}
        </button>
        <h5>Hospital Management System</h5>

        <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={openRoleMenu} title="Roles">
            <AssignmentInd />
          </IconButton>

          {/* === Role Menu === */}
          <Menu anchorEl={roleAnchor} open={Boolean(roleAnchor)} onClose={closeRoleMenu}>
            <MenuItem
              onClick={(e) => {
                closeRoleMenu();
                openStaffMenu(e);
              }}
            >
              👥 Staff ▸
            </MenuItem>
          </Menu>

          {/* === Staff Submenu === */}
          <Menu anchorEl={staffAnchor} open={Boolean(staffAnchor)} onClose={closeStaffMenu}>
            <MenuItem onClick={(e) => { closeStaffMenu(); openReceptionistMenu(e); }}>
              📋 Receptionist ▸
            </MenuItem>
            {/* <MenuItem onClick={(e) => { closeStaffMenu(); openNurseMenu(e); }}>
              🧑‍⚕️ Nurse ▸
            </MenuItem> */}
            <MenuItem onClick={(e) => { closeStaffMenu(); openLabMenu(e); }}>
              🧪 Lab Dashboard ▸
            </MenuItem>
            <MenuItem onClick={(e) => { closeStaffMenu(); openInventoryMenu(e); }}>
              📦 Inventory Manager ▸
            </MenuItem>
          </Menu>

          {/* === Receptionist Submenu === */}
          <Menu anchorEl={receptionistAnchor} open={Boolean(receptionistAnchor)} onClose={closeReceptionistMenu}>
           {[
    { to: "/admin-dashboard/receptionist/patient-form", label: "👤 Patient" },
    { to: "/admin-dashboard/receptionist/viewPatient", label: "👀 View Patient" },
    { to: "/admin-dashboard/receptionist/visit-form", label: "📝 Visit Form" },
    { to: "/admin-dashboard/receptionist/patient-visits-viewer", label: "📋 Patient Visits Viewer" },
    { to: "/admin-dashboard/receptionist/UpdatePatientStatus", label: "🔄 Update Patient Status" },
    { to: "/admin-dashboard/receptionist/IPDAdmissionForm", label: "🏥 IPD Admission Form" },
    { to: "/admin-dashboard/receptionist/ProcedureForm", label: "🧪 Procedure Form" },
    { to: "/admin-dashboard/receptionist/ViewAnesthesiaForm", label: "💉 View Anesthesia Form" },
    { to: "/admin-dashboard/receptionist/LabourRoom", label: "👶 Labour Room" },
    { to: "/admin-dashboard/receptionist/ViewLabourRoom", label: "👀 View Labour Room" },
    { to: "/admin-dashboard/receptionist/Billing", label: "💳 Billing" },
    { to: "/admin-dashboard/receptionist/ViewBill", label: "🧾 View Bill" },
    { to: "/admin-dashboard/receptionist/PaymentForm", label: "💰 Payment Form" },
    { to: "/admin-dashboard/receptionist/DischargePatient", label: "🚪 Discharge Patient" },
    { to: "/admin-dashboard/receptionist/BillPaymentHistory", label: "📜 Bill Payment History" },
  ].map((item, i) => (
              <MenuItem key={i} component={Link} to={item.to} onClick={closeReceptionistMenu}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* === Nurse Submenu === */}
          <Menu anchorEl={nurseAnchor} open={Boolean(nurseAnchor)} onClose={closeNurseMenu}>
            {[
              { to: "nurse/NurseIPDAdmissionList", label: "🏥 IPD Admissions" },
              { to: "nurse/ViewDailyReports", label: "📋 Daily Reports" },
              { to: "nurse/NurseScheduledProcedures", label: "🧪 Scheduled Procedures" },
            ].map((item, i) => (
              <MenuItem key={i} component={Link} to={item.to} onClick={closeNurseMenu}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          {/* === Lab Submenu === */}
       <Menu anchorEl={labAnchor} open={Boolean(labAnchor)} onClose={closeLabMenu}>
  {[
    { to: "/admin-dashboard/lab-technician/dashboard", label: "🏠 Lab Dashboard" },
    { to: "/admin-dashboard/lab-technician/patients", label: "🧍 Patients" },
    { to: "/admin-dashboard/lab-technician/add-test", label: "🧪 Add Test" },
    { to: "/admin-dashboard/lab-technician/appointments", label: "📅 Appointments" },
    { to: "/admin-dashboard/lab-technician/upload-report", label: "📄 Upload Report" },
  ].map((item, i) => (
    <MenuItem key={i} component={Link} to={item.to} onClick={closeLabMenu}>
      {item.label}
    </MenuItem>
  ))}
</Menu>


       {/* === Inventory Submenu === */}
<Menu anchorEl={inventoryAnchor} open={Boolean(inventoryAnchor)} onClose={closeInventoryMenu}>
  {[
    { to: "/admin-dashboard/inventory/InventoryForm", label: "➕ Inventory Form" },
    { to: "/admin-dashboard/inventory/InventoryList", label: "📋 Inventory List" },
    { to: "/admin-dashboard/inventory/RecordTransactionForm", label: "💰 Record Transaction" },
    { to: "/admin-dashboard/inventory/TransactionHistoryForm", label: "📜 Transaction History" },
  ].map((item, i) => (
    <MenuItem key={i} component={Link} to={item.to} onClick={closeInventoryMenu}>
      {item.label}
    </MenuItem>
  ))}
</Menu>


          {/* === Doctor Submenu === */}
          <Menu anchorEl={doctorAnchor} open={Boolean(doctorAnchor)} onClose={closeDoctorMenu}>
            {[
              { to: "doctor", label: "🏠 Home" },
              { to: "doctor/opd-consultation", label: "📝 OPD Consultation" },
              { to: "doctor/previous-consultations", label: "📋 Previous Consultations" },
            ].map((item, i) => (
              <MenuItem key={i} component={Link} to={item.to} onClick={closeDoctorMenu}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          <IconButton
            color="inherit"
            onClick={() => {
              localStorage.removeItem('jwt');
              window.location.href = '/';
            }}
            edge="end"
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </div>

      {/* === Sidebar === */}
     <div
  className={`sidebar no-print ${sidebarOpen ? "open" : ""}`}
  style={styles.sidebar}
>

        <nav style={styles.nav}>
          <Link to="" onClick={() => setActiveModuleLabel('')} style={activeModuleLabel === '' ? activeLinkStyle : linkStyle}>
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
              fontSize: '14px',
            }}
          />

          {modules
            .filter((mod) => mod.label.toLowerCase().includes(searchTerm))
            .map((mod, index) => (
              <div key={index} style={{ width: '100%' }}>
                <button
                  onClick={() => {
                    const isOpening = !mod.dropdownOpen;
                    modules.forEach((m) => m.setDropdownOpen(false));
                    mod.setDropdownOpen(isOpening);
                    setActiveModuleLabel(isOpening ? mod.label : '');
                  }}
                  style={{
                    ...(activeModuleLabel === mod.label ? activeLinkStyle : linkStyle),
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{mod.icon} {mod.label}</span>
                  <span>{mod.dropdownOpen ? '▲' : '▼'}</span>
                </button>

                {mod.dropdownOpen && <div style={styles.dropdown}>{mod.content}</div>}
                <hr style={styles.hr} />
              </div>
            ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
    <div
  className="main"
  style={{
    ...styles.main,
    marginLeft: sidebarOpen ? '260px' : '0', // 👈 dynamic adjustment
    transition: 'margin-left 0.3s ease-in-out',
  }}
>
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
  overflow: 'hidden',
  backgroundColor: '#f0f4f8', // 🌈 Light background for whole screen
}
,
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
  marginTop: '50px',         // navbar height
  marginLeft: '260px',       // sidebar width (for desktop)
  padding: '20px',
  overflowY: 'auto',         // ✅ allow vertical scroll inside main content
  height: 'calc(100vh - 50px)',
  backgroundColor: '#f9fafb'
}

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

