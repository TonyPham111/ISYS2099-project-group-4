import { useNavigate, useParams } from "react-router-dom";
import * as patientService from "@/services/patientService";
import PatientInfo from "./PatientInfo";
import { Routes, Route } from "react-router-dom";
import PatientTreatmentHistory from "./PatientTreatmentHistory";
import PatientDetailNavbar from "./PatientDetailNavbar";
import PatientDiagnosis from "./PatientDiagnosis";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import ProtectedRoute from "@/component/auth/ProtectedRoute";
import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";
import BackButton from "@/component/ui/Button/BackButton";
import PatientTest from "./PatientTest";
export default function PatientDetailRouter() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/patients/${id}`,
    fetcher
  );
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isloading data</div>;
  }
  if (data) {
    return (
      <section className="w-full h-full relative">
        <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
          <PatientDetailNavbar />
          <h5 className="text-custom-dark-300">
            {/*--user info----*/}#{data.id} {data.last_name} {data.first_name}
          </h5>
        </div>

        {/*------------------main part---------------*/}
        <section className="w-full h-[90%] py-3">
          <Routes>
            <Route path="/personal-information" element={<PatientInfo />} />
            <Route
              element={
                <ProtectedRoute
                  condition={
                    userData.job_role == "Doctor" ||
                    userData.job_role == "Nurse"
                  }
                />
              }
            >
              <Route
                path="/treatment-history"
                element={<PatientTreatmentHistory />}
              />
              <Route path="/test" element={<PatientTest/>} />
              {/* <Route path="/diagnosis" element={<PatientAllergies />} /> */}
              <Route path="/diagnosis" element={<PatientDiagnosis />} />
            </Route>
          </Routes>
        </section>

        {/*--------------back button-------------*/}
        <BackButton />
      </section>
    );
  }
}
