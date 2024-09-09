import { useNavigate, useParams} from "react-router-dom";
import PatientInfo from "./PatientInfo";
import { Routes, Route } from "react-router-dom";
import PatientTreatmentHistory from "./PatientTreatmentHistory";
import PatientDetailNavbar from "./PatientDetailNavbar";
import PatientDiagnosis from "./PatientDiagnosis";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import ProtectedRoute from "@/component/auth/ProtectedRoute";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/userContext";
import BackButton from "@/component/ui/Button/BackButton";
import PatientTest from "./PatientTest";
import PatientAllergies from "./PatientAllergies";

export default function PatientDetailRouter() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/patients/${id}`,
    fetcher
  );
 useEffect(()=>{
  // console.log(`check patient data: ${JSON.stringify(data)}`);
 },[data])
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
            {/*--user info----*/}#{data[0].id} {data[0].full_name} 
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
              <Route path="/allergies" element={<PatientAllergies />} />
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
