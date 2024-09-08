import { Link, Route, Routes, useLocation } from "react-router-dom";
import Staff from "./Staff";
import StaffDetailRouter from "./StaffDetail/StaffDetailRouter";
import ProtectedRoute from "@/component/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import StaffTrainingMaterial from "./StaffTrainingMaterial";
const StaffRouter = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  return (
    <section className="w-11/12 h-5/6 bg-white rounded-2xl p-5 flex flex-col gap-4">
      <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
        <StaffNavbar />
      </div>
      <Routes>
        <Route path="/">
          <Route index element={<Staff />} />
          {/* <Route
            element={
              <ProtectedRoute condition={Number(id)} redirectTo={"/staff"} />
            }
          > */}
            <Route path=":id/*" element={<StaffDetailRouter />} />
          {/* </Route> */}
          <Route path="/staff-training-material" element={<StaffTrainingMaterial/>} />
        </Route>
      </Routes>
    </section>
  );
};
export default StaffRouter;

function StaffNavbar() {
  const [activeItem, setActiveItem] = useState();
  const location = useLocation();
  useEffect(() => {
    /*need to set active link when router change because if not it will wrongly reorder activeItem*/
      console.log(`check location: ${location.pathname.split('/')[2]}`)
    if (activeItem !== location.pathname.split("/")[2]) {
      setActiveItem(location.pathname.split("/")[2]);
    }
  }, [location]);
  return (
    <nav className="flex gap-[30px]">
      <Link
        className={`${
          activeItem == "staff"
            ? "text-custom-blue border-b-2 border-solid border-custom-blue"
            : "text-custom-dark-300"
        }`}
        to={"./personal-information"}
      >
        <h4>Staff List</h4>
      </Link>
      <Link
        className={`${
          activeItem == "staff-training-material"
            ? "text-custom-blue border-b-2 border-solid border-custom-blue"
            : "text-custom-dark-300"
        }`}
        to={"./staff-training-material"}
      >
        <h4>Training Material</h4>
      </Link>
    </nav>
  );
}
