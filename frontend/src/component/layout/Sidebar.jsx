import { button } from "primereact/button";
import { IoHome } from "react-icons/io5";
import { FaUserNurse } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBusinessTime } from "react-icons/fa";
import { UserContext } from "@/contexts/userContext";

const Sidebar = ({}) => {
  const { userData } = useContext(UserContext);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState();
  const navigate = useNavigate();
  const handleOnClick = (navigationLink) => {
    navigate(`/${navigationLink}`);
  };
  useEffect(() => {
    /*need to set active link when router change because if not it will wrongly reorder activeItem*/
    if (activeItem !== location.pathname.split("/")) {
      setActiveItem(location.pathname.split("/")[1]);
    }
  }, [location]);
  return (
    <section className="min-w-[70px] h-full bg-white ">
      <section className="w-full mt-[80px] flex items-center flex-col gap-[50px]">
        <button
          onClick={() => {
            handleOnClick("dashboard");
          }}
          className={`flex justify-center items-center p-3 ${
            activeItem == "dashboard" ? "bg-custom-blue" : ""
          }`}
          variant="outline"
          size="icon"
        >
          <IoHome
            className={`h-6 w-6 ${
              activeItem == "dashboard" ? "text-white" : "text-custom-blue"
            }`}
          />
        </button>
        <button
          onClick={() => {
            handleOnClick("patient");
          }}
          className={`flex justify-center items-center p-3 ${
            activeItem == "patient" ? "bg-custom-blue" : ""
          }`}
          variant="outline"
          size="icon"
        >
          <MdPeopleAlt
            className={`h-6 w-6 ${
              activeItem == "patient" ? "text-white" : "text-custom-blue"
            }`}
          />
        </button>
        <button
          onClick={() => {
            handleOnClick("staff/staff-list");
          }}
          className={`flex justify-center items-center p-3 ${
            activeItem == "staff" ? "bg-custom-blue" : ""
          }`}
          variant="outline"
          size="icon"
        >
          <FaUserNurse
            className={`h-6 w-6 ${
              activeItem == "staff" ? "text-white" : "text-custom-blue"
            }`}
          />
        </button>
        {userData.job_role == "FrontDesk" && (
          <button
            onClick={() => {
              handleOnClick("appointment");
            }}
            className={`flex justify-center items-center p-3 ${
              activeItem == "appointment" ? "bg-custom-blue" : ""
            }`}
            variant="outline"
            size="icon"
          >
            <FaCalendarAlt
              className={`h-6 w-6 ${
                activeItem == "appointment" ? "text-white" : "text-custom-blue"
              }`}
            />
          </button>
        )}
        <button
          onClick={() => {
            handleOnClick("working-schedule");
          }}
          className={`flex justify-center items-center p-3 ${
            activeItem == "working-schedule" ? "bg-custom-blue" : ""
          }`}
          variant="outline"
          size="icon"
        >
          <FaBusinessTime
            className={`h-6 w-6 ${
              activeItem == "working-schedule"
                ? "text-white"
                : "text-custom-blue"
            }`}
          />
        </button>
        {userData.job_role !== "FrontDesk" && (
          <button
            onClick={() => {
              handleOnClick("report");
            }}
            className={`flex justify-center items-center p-3 ${
              activeItem == "report" ? "bg-custom-blue" : ""
            }`}
            variant="outline"
            size="icon"
          >
            <LuClipboardList
              className={`h-6 w-6 ${
                activeItem == "report" ? "text-white" : "text-custom-blue"
              }`}
            />
          </button>
        )}
      </section>
    </section>
  );
};

export default Sidebar;
