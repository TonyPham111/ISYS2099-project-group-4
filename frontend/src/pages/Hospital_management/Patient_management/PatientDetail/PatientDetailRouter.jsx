import {useNavigate, useParams } from "react-router-dom";
import * as patientService from "@/services/patientService";
import PatientInfo from "./router/PatientInfo";
import { Routes, Route } from "react-router-dom";
import PatientTreatmentHistory from "./router/PatientTreatmentHistory";
import PatientDetailNavbar from "./PatientDetailNavbar";
export default function PatientDetailRouter() {
  const navigate = useNavigate();
  const { id } = useParams();
  const patientData = patientService.getPatient(id);

  return (
    <section className="w-full h-full relative">
      <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
        <PatientDetailNavbar/>
        <h5 className="text-custom-dark-300">{/*--user info----*/}
          #{patientData.id} {patientData.last_name} {patientData.first_name}
        </h5>
      </div>

      {/*------------------main part---------------*/}
      <section className="w-full h-[90%] py-3">
        <Routes>
          <Route path="/personal-information" element={<PatientInfo />} />
          <Route path="/treatment-history" element={<PatientTreatmentHistory/>} />
          {/* <Route path="/test" element={<PatientTest/>} />
          <Route path="/diagnosis" element={<PatientDiagnosis/>} /> */}
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
