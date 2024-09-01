import { Route, Routes } from "react-router-dom";
import Staff from "./Staff";
import StaffDetailRouter from "./StaffDetail/StaffDetailRouter";
const StaffRouter = () => {
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      <Routes>
        <Route path="/">
          <Route index element={<Staff/>}/>
          <Route path=":id/*" element={<StaffDetailRouter/>}></Route>
        </Route>
      </Routes>
    </section>
  );
};
export default StaffRouter;
