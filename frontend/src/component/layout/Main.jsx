import Dashboard from "../../pages/Hospital_management/Dasboard/Dasboard";
import PatientRouter from "../../pages/Hospital_management/Patient_management/PatientRouter";
import StaffRouter from "../../pages/Hospital_management/Staff_management/StaffRouter";
import Appointment from "../../pages/Hospital_management/Appointment_management/Appointment";
import Report from "../../pages/Hospital_management/Report_management/Report";
import Login from "../../pages/Hospital_management/Login_management/Login";
import {  Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ScheduleContextProvider } from "@/contexts/scheduleContext";
import DoctorWorkingSchedule from "@/pages/Hospital_management/Doctor_working_schedule_management/DoctorWorkingSchedule";

const Main = () => {
  return (
    <section className="mt-[50px] w-main h-main flex items-center justify-center">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient/*" element={<PatientRouter />} />
        <Route path="/staff/*" element={<StaffRouter />} />

        <Route path="/appointment/*" element={<Appointment />} />
        <Route path="/report/*" element={<Report />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/appointment/*"
          element={
            <ScheduleContextProvider>
              <Appointment />
            </ScheduleContextProvider>
          }
        />
        <Route
          path="/doctor-working-schedule/*"
          element={
            <ScheduleContextProvider>
              <DoctorWorkingSchedule />
            </ScheduleContextProvider>
          }
        />
        <Route path="/report/*" element={<Report />} />

      </Routes>
    </section>
  );
};

export default Main;
