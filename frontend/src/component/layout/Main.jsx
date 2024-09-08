import Dashboard from "../../pages/Hospital_management/Dasboard/Dasboard";
import PatientRouter from "../../pages/Hospital_management/Patient_management/PatientRouter";
import StaffRouter from "../../pages/Hospital_management/Staff_management/StaffRouter";
import Appointment from "../../pages/Hospital_management/Appointment_management/Appointment";
import { useContext, useState } from "react";
import { Router, Routes, Route } from "react-router-dom";
import { ScheduleContextProvider } from "@/contexts/scheduleContext";
import WorkingSchedule from "@/pages/Hospital_management/Doctor_working_schedule_management/WorkingSchedule";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import ErrorPage from "@/pages/ErrorPage";
import AuthComponent from "../auth/AuthComponent";
import { UserContext } from "@/contexts/userContext";
import ReportRouter from "@/pages/Hospital_management/Report_management/ReportRouter";
const Main = () => {
  const { userData } = useContext(UserContext);
  return (
    <section className="mt-[50px] w-main h-main flex items-center justify-center">
      <Routes>
        <Route element={<ProtectedRoute condition={!userData} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthComponent />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient/*" element={<PatientRouter />} />
          <Route path="/staff/*" element={<StaffRouter />} />
          <Route
            element={
              <ProtectedRoute condition={userData?.job_role == "FrontDesk"} />
            }
          >
            <Route
              path="/appointment/*"
              element={
                <ScheduleContextProvider>
                  <Appointment />
                </ScheduleContextProvider>
              }
            />
          </Route>

          <Route
            path="/working-schedule"
            element={
              <ScheduleContextProvider>
                <WorkingSchedule />
              </ScheduleContextProvider>
            }
          />
        </Route>
        <Route
          element={
            <ProtectedRoute condition={userData?.job_role !== "FrontDesk"} />
          }
        >
          <Route path="/report/*" element={<ReportRouter />} />
        </Route>
        <Route element={<ProtectedRoute condition={false} />}>
          <Route path="*"/>
        </Route>
      </Routes>
    </section>
  );
};

export default Main;
