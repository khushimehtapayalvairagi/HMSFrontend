// App.js
import React from 'react';
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
import DoctorAvailabilityForm from './components/Dashboard/DoctorAvailable';
import VisitForm from './components/Dashboard/VisitForm';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
// import OPDConsultationForm from './components/Dashboard/OPDConsulationForm';
import PatientVisitsViewer from './components/Dashboard/PatientVisitsViewer';
import DoctorDashboardHome from './components/Dashboard/DoctorDashboardHome';
import OPDConsultationForm from './components/Dashboard/OPDConsultationForm';
import PreviousConsultations from './components/Dashboard/PreviousConsultantPatient';
import UpdateVisitStatusPage from './components/Dashboard/UpdateVisitStatus';
import ReceptionistHome from './components/Dashboard/receptionistHome';
import IPDAdmissionForm from './components/Dashboard/IPDAdmissionform'
import IPDAdmissionList from './components/Dashboard/IPDAdmissionList';
import ProcedureForm from './components/Dashboard/ProcedureForm';
import AnesthesiaForm from './components/Dashboard/AnesthesiaForm';
import ViewAnesthesiaRecord from './components/Dashboard/ViewAnthesiaRecord';
import LabourRoomDetails from './components/Dashboard/LabourRoom';

import NurseDashboard from './components/Dashboard/NurseDashboard';
import LabourRoomDetailViewer from './components/Dashboard/LabourRoomDetailViewer.js';
import DailyReports from './components/Dashboard/DailyReports.js';

const App = () => {
  return (
    <Routes>
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute element={<AdminDashboard />} role="ADMIN" />}
      >
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
   <Route
  path="/receptionist-dashboard"
  element={<ProtectedRoute element={<ReceptionistDashboard />} role="RECEPTIONIST" />}
>
  <Route path="Home" element={<ReceptionistHome/>} />
  <Route path="patient-form" element={<PatientForm/>} />
   <Route path="viewPatient" element={<ViewPatient/>} />
   <Route path="Doctor-Availablity-check" element={<DoctorAvailabilityForm/>} />
      <Route path="visit-form" element={<VisitForm/>} />
       <Route path="patient-visits-viewer" element={<PatientVisitsViewer/>} />
<Route path="UpdatePatientStatus" element={<UpdateVisitStatusPage/>} />
<Route path="IPDAdmissionForm" element={<IPDAdmissionForm/>} />
<Route path="IPDAdmissionList/:patientId" element={<IPDAdmissionList />} />

<Route path="ProcedureForm" element={<ProcedureForm/>} />
<Route path="AnesthesiaForm/:procedureScheduleId" element={<AnesthesiaForm/>} />
<Route path="ViewAnesthesiaForm" element={<ViewAnesthesiaRecord/>} />
 <Route path="LabourRoom/:procedureScheduleId/:patientId" element={<LabourRoomDetails />} />

<Route path="ViewLabourRoom" element={<LabourRoomDetailViewer/>} />
</Route>
<Route path="/doctor-dashboard" element={<ProtectedRoute element={<DoctorDashboard />} role="DOCTOR" />}>
 <Route index element={<DoctorDashboardHome />} />
<Route path="home" element={<DoctorDashboardHome />} />
   <Route index element={<OPDConsultationForm />} />
   <Route path="ConsultationForm/:visitId" element={<OPDConsultationForm />} />
    <Route path="PreviousConsultantPatient/:patientId" element={<PreviousConsultations />} />  

</Route>
<Route path="/nurse-dashboard"  element={<NurseDashboard />}  >
<Route path ="DailyReports" element ={<DailyReports/>}/>
</Route>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  );
};

export default App;
