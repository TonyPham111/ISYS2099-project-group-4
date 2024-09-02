import { UserContext } from "@/contexts/userContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
export function ReportPatientNavbar() {
  const { userData } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState();
  const location = useLocation();
  useEffect(() => {
    /*need to set active link when router change because if not it will wrongly reorder activeItem*/
    console.log(`check location split: ${location.pathname.split("/")}`);
    if (activeItem !== location.pathname.split("/")[3]) {
      setActiveItem(location.pathname.split("/")[3]);
    }
  }, [location]);
  return (
    <nav className="flex gap-[30px]">
      {(userData.job_role == "Doctor" || userData.job_role == "Nurse") && (
        <Link
          className={`${
            activeItem == "treatment-history"
              ? "text-custom-blue border-b-2 border-solid border-custom-blue"
              : "text-custom-dark-300"
          }`}
          to={"./treatment-history"}
        >
          <h4>Treatment History</h4>
        </Link>
      )}
      {userData.job_role == "BusinessOfficer" && (
        <Link
          className={`${
            activeItem === "billing"
              ? "text-custom-blue border-b-2 border-solid border-custom-blue"
              : "text-custom-dark-300"
          }`}
          to={"./billing"}
        >
          <h4>Billing</h4>
        </Link>
      )}
    </nav>
  );
}

export function ReportStaffNavbar() {
  const { userData } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState();
  const location = useLocation();
  useEffect(() => {
    /*need to set active link when router change because if not it will wrongly reorder activeItem*/
    if (activeItem !== location.pathname.split("/")[3]) {
      setActiveItem(location.pathname.split("/")[3]);
    }
  }, [location]);
  return (
    <nav className="flex gap-[30px]">
      {userData.job_role == "HR" && (
        <>
          <Link
            className={`${
              activeItem == "job-change-history"
                ? "text-custom-blue border-b-2 border-solid border-custom-blue"
                : "text-custom-dark-300"
            }`}
            to={"./job-change-history"}
          >
            <h4>Job Change History</h4>
          </Link>
          <Link
            className={`${
              activeItem == "wage-change-history"
                ? "text-custom-blue border-b-2 border-solid border-custom-blue"
                : "text-custom-dark-300"
            }`}
            to={"./wage-change-history"}
          >
            <h4>Wage Change History</h4>
          </Link>
          <Link
            className={`${
              activeItem == "department-change-history"
                ? "text-custom-blue border-b-2 border-solid border-custom-blue"
                : "text-custom-dark-300"
            }`}
            to={"./department-change-history"}
          >
            <h4>Department Change History</h4>
          </Link>
          <Link
            className={`${
              activeItem == "doctor-work"
                ? "text-custom-blue border-b-2 border-solid border-custom-blue"
                : "text-custom-dark-300"
            }`}
            to={"./doctor-work"}
          >
            <h4>Doctor Work</h4>
          </Link>
        </>
      )}
    </nav>
  );
}
