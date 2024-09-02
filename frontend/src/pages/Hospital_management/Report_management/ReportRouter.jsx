import { Route, Routes } from "react-router-dom";
import ReportDashboard from "./ReportDashboard";
import { ReportPatientNavbar, ReportStaffNavbar } from "./ReportNavbar";
import BackButton from "@/component/ui/Button/BackButton";
import ProtectedRoute from "@/component/auth/ProtectedRoute";
import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import ReportTreatmentHistory from "./Patient_Report/ReportTreatmentHistory";
import ReportPatientBilling from "./Patient_Report/ReportPatientBilling";
import ReportDoctorWork from "./ReportDoctorWork";
import ReportJobChangeHistory from "./ReportJobChangeHistory";
import ReportWageChangeHistory from "./Patient_Report/ReportWageChangeHistory";
import ReportDepartmentChangeHistory from "./Patient_Report/ReportDepartmentChangeHistory";
export default function ReportRouter() {
  const { userData } = useContext(UserContext);
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      <Routes>
        <Route path="/">
          <Route index element={<ReportDashboard />} />
          <Route
            element={
              <ProtectedRoute
                condition={
                  userData.job_role == "Doctor" ||
                  userData.job_role == "Nurse" ||
                  userData.job_role == "BusinessOfficer"
                }
              />
            }
          >
            <Route path="patient/*" element={<ReportPatientRouter />} />
          </Route>
          <Route
            element={<ProtectedRoute condition={userData.job_role == "HR"} />}
          >
            <Route path="staff/*" element={<ReportStaffRouter />} />
          </Route>
        </Route>
      </Routes>
    </section>
  );
}

function ReportPatientRouter() {
  const { userData } = useContext(UserContext);
  return (
    <section className="w-full h-full relative">
      <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
        <ReportPatientNavbar />
      </div>

      {/*------------------main part---------------*/}
      <section className="w-full h-[90%] py-3">
        <Routes>
          <Route
            element={
              <ProtectedRoute
                condition={
                  userData.job_role == "Doctor" || userData.job_role == "Nurse"
                }
              />
            }
          >
            <Route
              path="/treatment-history"
              element={<ReportTreatmentHistory />}
            />
          </Route>
          <Route
            element={
              <ProtectedRoute
                condition={userData.job_role == "BusinessOfficer"}
              />
            }
          >
              <Route path="/billing" element={<ReportPatientBilling/>}/>
          </Route>
        </Routes>
      </section>

      {/*--------------back button-------------*/}
      <BackButton />
    </section>
  );
}
function ReportStaffRouter() {
  return (
    <section className="w-full h-full relative">
      <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
        <ReportStaffNavbar />
      </div>

      {/*------------------main part---------------*/}
      <section className="w-full h-[90%] py-3">
        <Routes>
          <Route>
          <Route path="/job-change-history" element={<ReportJobChangeHistory/>}/>
                <Route path="/wage-change-history" element={<ReportWageChangeHistory/>}/>
                <Route path="/department-change-history" element={<ReportDepartmentChangeHistory/>}/>
                <Route path="/doctor-work" element={<ReportDoctorWork/>}/> 
          </Route>
        </Routes>
      </section>

      {/*--------------back button-------------*/}
      <BackButton />
    </section>
  );
}
