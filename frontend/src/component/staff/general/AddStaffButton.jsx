import { useContext } from "react";
import { PopupContext } from "../../../contexts/popupContext";
import Popup from "../../ui/Popup";
import AddStaffForm from "./AddStaffForm";
const AddStaffButton = () => {
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
        Add new staff+
      </button>
      <Popup>
        <AddStaffForm/>
      </Popup>
    </>
  );
};
export default AddStaffButton;
