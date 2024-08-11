import { useContext } from "react";
import { PopupContext } from "../../../../contexts/popupContext";
import Popup from "../../../../component/Popup";
import RegisterPatientForm from "./RegisterPatientForm";
import { Button } from "primereact/button";
const RegisterButton = () => {
  const { setIsPopup } = useContext(PopupContext);
  const handleRegisterPatient = () => {
    setIsPopup(true);
  };
  return (
    <>
      <Button
        onClick={handleRegisterPatient}
        className="bg-custom-blue text-white"
      >
        Register new patient +
      </Button>
      <Popup>
        <RegisterPatientForm/>
      </Popup>
    </>
  );
};
export default RegisterButton;
