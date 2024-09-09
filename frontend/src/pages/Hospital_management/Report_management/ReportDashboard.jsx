import { UserContext } from "@/contexts/userContext";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { IoPeopleCircleSharp } from "react-icons/io5";

export default function ReportDashboard() {
  const { userData } = useContext(UserContext);
  const [patientNavigation, setPatientNavigation] = useState(null);
  const [staffNavigation, setStaffNavigation] = useState(null);
  useEffect(() => {
    if (
      (userData.job_role == "Doctor" || userData.job_role == "Nurse") &&
      !patientNavigation
    ) {
      setPatientNavigation("patient/treatment-history");
    } else if (userData.job_role == "BusinessOfficer" && !patientNavigation) {
      setPatientNavigation("patient/billing");
    } else if (userData.job_role == "HR" && !staffNavigation) {
      setStaffNavigation("staff/job-change-history");
    }
  }, [userData]);
  return (
    <section className="w-full h-full flex gap-[30px]">
      {(userData.job_role == "Doctor" ||
        userData.job_role == "Nurse" ||
        userData.job_role == "BusinessOfficer") && (
        <div className="flex flex-col items-center gap-[5px]">
          <ReportNavigateButton navigateTo={patientNavigation}>
            <IoPeopleCircleSharp className={`h-[30px] w-[30px] text-white`} />
          </ReportNavigateButton>
          <p className="text-custom-dark-300">Patient Report</p>
        </div>
      )}
      {userData.job_role == "HR" && (
        <div className="flex flex-col items-center gap-[5px]">
          <ReportNavigateButton navigateTo={staffNavigation}>
            <FaUserDoctor className={`h-[30px] w-[30px] text-white`} />
          </ReportNavigateButton>
          <p className="text-custom-dark-300">Staff Report</p>
        </div>
      )}
    </section>
  );
}

function ReportNavigateButton({ children, navigateTo }) {
  const navigate = useNavigate();
  function handleNavigate() {
    navigate(navigateTo);
  }
  return (
    <button
      onClick={handleNavigate}
      className={
        " w-[70px] h-[70px] flex justify-center items-center p-3 bg-custom-blue"
      }
      variant="outline"
      size="icon"
    >
      {children}
    </button>
  );
}
