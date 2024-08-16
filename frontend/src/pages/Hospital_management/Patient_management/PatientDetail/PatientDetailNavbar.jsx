import { useEffect, useState } from "react";
import { Link, useLocation} from "react-router-dom";
export default function PatientDetailNavbar() {
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
      <Link
        className={`${
          activeItem == "personal-information"
            ? "text-custom-blue border-b-2 border-solid border-custom-blue"
            : "text-custom-dark-300"
        }`}
        to={"./personal-information"}
      >
        <h4>Personal Information</h4>
      </Link>
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
      <Link
        className={`${
          activeItem === "test"
            ? "text-custom-blue border-b-2 border-solid border-custom-blue"
            : "text-custom-dark-300"
        }`}
        to={"./test"}
      >
        <h4>Test</h4>
      </Link>
      <Link
        className={`${
          activeItem == "diagnosis"
            ? "text-custom-blue border-b-2 border-solid border-custom-blue"
            : "text-custom-dark-300"
        }`}
        to={"./diagnosis"}
      >
        <h4>Diagnosis</h4>
      </Link>
    </nav>
  );
}
