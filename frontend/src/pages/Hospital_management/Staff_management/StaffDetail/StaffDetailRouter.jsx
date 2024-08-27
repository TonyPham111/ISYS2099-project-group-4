import { useNavigate, useParams } from "react-router-dom";
import * as staffService from "@/services/staffService";
import { Routes, Route } from "react-router-dom";
import StaffDetailNavbar from "./StaffDetailNavbar";
import StaffInfo from "./StaffInfo";
import StaffSchedule from "./StaffSchedule";
import { ScheduleContextProvider } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
export default function StaffDetailRouter() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/staffs/${id}`,
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
          <StaffDetailNavbar />
          <h5 className="text-custom-dark-300">
            {/*--user info----*/}#{data.id} {data.last_name}{" "}
            {data.first_name}
          </h5>
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

        <button
          onClick={() => {
            navigate("../");
          }}
          className="w-[150px] h-[50px] absolute -bottom-20 -left-5 bg-custom-blue text-white"
        >
          Back
        </button>
      </section>
    );
  }
}
