import { Route, Routes, useLocation } from "react-router-dom";
import Patient from "./Patient";
import PatientDetailRouter from "./PatientDetail/PatientDetailRouter";
import ProtectedRoute from "@/component/auth/ProtectedRoute";
const PatientRouter = () => {
  const location = useLocation();
  const id= location.pathname.split('/')[2];
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      <Routes>
        <Route path="/">
          <Route index element={<Patient/>}/>
          <Route element={<ProtectedRoute condition={Number(id)} redirectTo={'/patient'} />}>
          <Route path=":id/*" element={<PatientDetailRouter/>}></Route>
        </Route>
        </Route>
      </Routes>
    </section>
  );
};
export default PatientRouter;
