import { useNavigate, useParams } from "react-router-dom";
import * as staffService from "@/services/staffService";
import { Routes, Route } from "react-router-dom";
import StaffDetailNavbar from "./StaffDetailNavbar";
import StaffInfo from "./StaffInfo";
import StaffSchedule from "./StaffSchedule";
import { ScheduleContextProvider } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/userContext";
import BackButton from "@/component/ui/Button/BackButton";
export default function StaffDetailRouter() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const { id } = useParams();

  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/staffs/${id}`,
    fetcher
  );
  useEffect(() => {
    if (data && userData.job_role !== "HR" && userData.id !== data.manager_id) {
      navigate("/dashboard");
    }
  }, [userData, data]);
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isloading data</div>;
  }
  if (data) {
    return (
      <section className="w-full h-full relative">
        <div className="h-[70px] flex justify-between items-center border-b-2 border-solid border-custom-dark-100">
          <StaffDetailNavbar data={data} />
        </div>

        {/*------------------main part---------------*/}
        <section className="w-full h-[90%] py-3">
          <Routes>
            <Route path="/personal-information" element={<StaffInfo />} />
            <Route
              path="/schedule"
              element={
                <ScheduleContextProvider>
                  <StaffSchedule />
                </ScheduleContextProvider>
              }
            />
          </Routes>
        </section>

        {/*---------------- back button -------------*/}
        <BackButton/>
      </section>
    );
  }
}
