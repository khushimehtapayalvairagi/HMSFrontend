// App.js
import React from 'react';
import SocketContext from './context/SocketContext.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './Admin/components/AdminDashboard';
import AddUser from './Admin/components/Add_user';
import AdminHome from './Admin/components/AdminHome';
import ViewUsers from './Admin/components/view_user';
import Login from './components/Dashboard/Login';
import AddSpeciality from './Admin/components/AddSpeciality';
import AddLabour from './Admin/components/AddLabour';
import VisitRoom from './Admin/components/VisitRoom';
import AddDepartment from './Admin/components/AddDepartment';
import ProtectedRoute from './Routes/ProtectedRoute';
import VisitRoomCategory from './Admin/components/VisitRoomCategory';
import RoomCategory from './Admin/components/AddRoomCategory';
import VisitWard from './Admin/components/VisitWard';
import AddWard from './Admin/components/AddWard';
import Procedure from './Admin/components/AddProcedure';
import ViewProcedure from './Admin/components/ViewProcedure';
import AddManualCharge from './Admin/components/AddManualCharge';
import ViewManualCharge from './Admin/components/ViewManualCharge';
import AddRefferalPartner from './Admin/components/AddReferralPartner';
import ViewRefferalPartner from './Admin/components/ViewReferralPartner';
import AddOperationTheatre from './Admin/components/AddOperationTheatre';
import ViewOperationTheatre from './Admin/components/ViewoperationTheatre';
import ViewSpecialty from './Admin/components/ViewSpecialty';
import ViewDepartment from './Admin/components/ViewDepartment';
import ReceptionistDashboard from './components/Dashboard/ReceptionistDashboard';
import PatientForm from './components/Dashboard/patient';
import ViewPatient from './components/Dashboard/ViewPatient';

import VisitForm from './components/Dashboard/VisitForm';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
// import OPDConsultationForm from './components/Dashboard/OPDConsulationForm';
import PatientVisitsViewer from './components/Dashboard/PatientVisitsViewer';
import DoctorDashboardHome from './components/Dashboard/DoctorDashboardHome';
import OPDConsultationForm from './components/Dashboard/OPDConsultationForm';
import PreviousConsultations from './components/Dashboard/PreviousConsultantPatient';
import UpdateVisitStatusPage from './components/Dashboard/UpdateVisitStatus';
import IPDAdmissionForm from './components/Dashboard/IPDAdmissionform'
import IPDAdmissionList from './components/Dashboard/IPDAdmissionList';
import ProcedureForm from './components/Dashboard/ProcedureForm';
import AnesthesiaForm from './components/Dashboard/AnesthesiaForm';
import ViewAnesthesiaRecord from './components/Dashboard/ViewAnthesiaRecord';
import LabourRoom from './components/Dashboard/LabourRoom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NurseDashboard from './components/Dashboard/NurseDashboard';
import LabourRoomDetailViewer from './components/Dashboard/LabourRoomDetailViewer.js';
import DailyReports from './components/Dashboard/DailyReports.js';
import NurseIPDAdmissionList from './components/Dashboard/NurseIPDAdmissionList.js';
import ViewDailyReports from './components/Dashboard/ViewDailyReports.js';
import NurseScheduledProcedures from './components/Dashboard/NurseScheduledProcedures.js';
import DischargePatient from './components/Dashboard/DischargePatient.js';
import InventoryManagerDashboard from './components/Dashboard/InventoryManagerDashboard.js';
import InventoryForm from './components/Dashboard/InventoryForm.js';
import InventoryList from './components/Dashboard/InventoryList.js';
import EditInventoryForm from './components/Dashboard/EditInventoryForm.js';
import RecordTransactionForm from './components/Dashboard/RecordTransactionForm.js';
import TransactionHistoryForm from './components/Dashboard/TransactionHistoryForm.js';
import CreateBillForm from './components/Dashboard/CreateBillForm.js';
import ViewBill from './components/Dashboard/ViewBill.js';
import PaymentForm from './components/Dashboard/PaymentForm.js';
import BillPaymentHistory from './components/Dashboard/BillPaymentHistory.js';
import IPDReportPage from './Admin/components/IPDReportPage.js';
import OPDReportPage from './Admin/components/OPDReportPage.js';

const App = () => {
  return (
    <>
    <Routes>
    <Route element={<ProtectedRoute role="ADMIN" />}>
<Route
        path="/admin-dashboard"
         element={<AdminDashboard />} 
      >
       <Route path="reports">
    <Route path="opd-register" element={<OPDReportPage />} />
    <Route path="ipd-register" element={<IPDReportPage />} />
  </Route>   
  <Route index element={<AdminHome />} /> {/* Default dashboard home */}
        <Route path="add-user" element={<AddUser />} />
        <Route path="view-user/:type" element={<ViewUsers />} />
         <Route path="specialty" element={<AddSpeciality />} />
          <Route path="ViewSpecialty" element={<ViewSpecialty />} />
                   <Route path="department" element={<AddDepartment />} />
                    <Route path="ViewDepartment" element={<ViewDepartment />} />
                   <Route path="labourRoom" element={<AddLabour />} />
                     <Route path="visit-room" element={<VisitRoom />} />
                         <Route path="Room-Category" element={<RoomCategory />} />
                     <Route path="visitRoom" element={<VisitRoomCategory />} />
                      <Route path="Ward" element={<AddWard />} />
                     <Route path="visitWard" element={<VisitWard />} />
                    <Route path="procedure" element={<Procedure />} />
                     <Route path="view-procedure" element={<ViewProcedure />} /> 
                     <Route path="manualCharge" element={<AddManualCharge />} />
                     <Route path="view-manualCharge" element={<ViewManualCharge/>} />  
                      <Route path="partner" element={<AddRefferalPartner />} />
                     <Route path="view-partners" element={<ViewRefferalPartner/>} />  
                       <Route path="operation-theatre" element={<AddOperationTheatre />} />
                     <Route path="view-operation-theatre" element={<ViewOperationTheatre/>} />          
      
      </Route>
      </Route>
          <Route element={<><SocketContext/> <ProtectedRoute role="STAFF" /> </>}>
 <Route
  path="/receptionist-dashboard"element={<ReceptionistDashboard />}
>
  <Route path="patient-form" element={<PatientForm/>} />
   <Route path="viewPatient" element={<ViewPatient/>} />
      <Route path="visit-form" element={<VisitForm/>} />
       <Route path="patient-visits-viewer" element={<PatientVisitsViewer/>} />
<Route path="UpdatePatientStatus" element={<UpdateVisitStatusPage/>} />
<Route path="IPDAdmissionForm" element={<IPDAdmissionForm/>} />
<Route path="IPDAdmissionList/:patientId" element={<IPDAdmissionList />} />

<Route path="ProcedureForm" element={<ProcedureForm/>} />
<Route path="AnesthesiaForm/:procedureScheduleId" element={<AnesthesiaForm />} />
 
<Route path="ViewAnesthesiaForm" element={<ViewAnesthesiaRecord />} />

 <Route path="LabourRoom" element={<LabourRoom />} />

<Route path="ViewLabourRoom" element={<LabourRoomDetailViewer/>} />
<Route path="DischargePatient" element={<DischargePatient/>} />
<Route path="Billing" element={<CreateBillForm/>} />
<Route path='ViewBill' element={<ViewBill/>}/>
<Route path ="PaymentForm" element={<PaymentForm/>}/>
<Route path ="BillPaymentHistory" element ={<BillPaymentHistory/>}/>
</Route>
      </Route>
 <Route  element={<ProtectedRoute role="DOCTOR" />} >
    <Route path="/doctor-dashboard"  element={<DoctorDashboard />}>
 <Route index element={<DoctorDashboardHome />} />
<Route path="home" element={<DoctorDashboardHome />} />
   <Route index element={<OPDConsultationForm />} />
   <Route path="ConsultationForm/:visitId" element={<OPDConsultationForm />} />
    <Route path="PreviousConsultantPatient/:patientId" element={<PreviousConsultations />} />  

</Route>
  </Route>

<Route  element={<ProtectedRoute role="STAFF" />} >
<Route path="/nurse-dashboard"  element={<NurseDashboard />}>
<Route path ="NurseIPDAdmissionList" element ={<NurseIPDAdmissionList/>}/>
<Route path ="DailyReports" element ={<DailyReports/>}/>
<Route path="ViewDailyReports" element={<ViewDailyReports />} />
<Route path ="NurseScheduledProcedures" element={<NurseScheduledProcedures/>}/>
</Route>
</Route>
<Route element={<ProtectedRoute role="STAFF" />}>
<Route path="/inventoryManager-dashboard"  element={<InventoryManagerDashboard />} >
<Route path ="InventoryForm" element ={<InventoryForm/>}/>
<Route path ="InventoryList" element ={<InventoryList/>}/>
<Route path="inventory/edit/:id" element={<EditInventoryForm />} />
<Route path ="RecordTransactionForm" element={<RecordTransactionForm/>}/>
<Route path ="TransactionHistoryForm" element={<TransactionHistoryForm/>}/>
</Route>
</Route>

      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
</>
  );
};

export default App;
