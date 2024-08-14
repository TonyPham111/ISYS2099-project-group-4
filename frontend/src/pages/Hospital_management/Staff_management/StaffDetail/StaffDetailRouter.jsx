import {useNavigate, useParams } from "react-router-dom";
import * as staffService from "@/services/staffService";
import { Routes, Route } from "react-router-dom";
import StaffDetailNavbar from "./StaffDetailNavbar";
import StaffInfo from "./StaffInfo";
export default function StaffDetailRouter() {
  const navigate = useNavigate();
  const { id } = useParams();
  const staffData = staffService.getStaff(id);

  return (
    <section className="w-full h-full relative">
      <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
        <StaffDetailNavbar/>
        <h5 className="text-custom-dark-300">{/*--user info----*/}
          #{staffData.id} {staffData.last_name} {staffData.first_name}
        </h5>
      </div>

      {/*------------------main part---------------*/}
      <section className="w-full h-[90%] py-3">
        <Routes>
          <Route path="/personal-information" element={<StaffInfo/>} />
          {/* <Route path="/treatment-history" element={<PatientTreatmentHistory/>} /> */}
        </Routes>
      </section>
      
      <button
        onClick={()=>{navigate("../")}}
        className="w-[150px] h-[50px] absolute -bottom-20 -left-5 bg-custom-blue text-white"
      >
        Back
      </button>
    </section>
  );
}
