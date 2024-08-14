import { Route, Routes } from "react-router-dom";
import Patient from "./Patient";
import PatientDetailRouter from "./PatientDetail/PatientDetailRouter";
const PatientRouter = () => {
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      <Routes>
        <Route path="/">
          <Route index element={<Patient/>}/>
          <Route path=":id/*" element={<PatientDetailRouter/>}></Route>
        </Route>
      </Routes>
    </section>
  );
};
export default PatientRouter;
