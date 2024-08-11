import Dashboard from "../../pages/Hospital_management/Dasboard/Dasboard";
import Patient from "../../pages/Hospital_management/Patient_management/Patient";
import Staff from "../../pages/Hospital_management/Staff_management/Staff";
import Appointment from "../../pages/Hospital_management/Appointment_management/Appointment";
import Report from "../../pages/Hospital_management/Report_management/Report";
import { useState } from "react";
import { Router, Routes, Route } from "react-router-dom";
const Main = () => {
  const [text, setText] = useState("");
  return (
    <section className="mt-[50px] w-main h-main flex items-center justify-center">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
        <Route path="/staff" element={<Staff/>} />
        <Route path="/appointment" element={<Appointment/>} />
        <Route path="/report" element={<Report/>} />
      </Routes>
    </section>
  );
};

export default Main;
