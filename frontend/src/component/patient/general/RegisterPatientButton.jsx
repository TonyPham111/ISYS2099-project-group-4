import { useContext } from "react";
import { PopupContext } from "../../../contexts/popupContext";
import Popup from "../../ui/Popup";
import RegisterPatientForm from "./RegisterPatientForm";
const RegisterPatientButton = () => {
  const { setIsPopup } = useContext(PopupContext);
  const handleRegisterPatient = () => {
    setIsPopup(true);
  };
  return (
    <>
      <button
        onClick={handleRegisterPatient}
        className="bg-custom-blue text-white"
      >
        Register new patient +
      </button>
      <Popup>
        <RegisterPatientForm/>
      </Popup>
    </>
  );
};
export default RegisterPatientButton;
