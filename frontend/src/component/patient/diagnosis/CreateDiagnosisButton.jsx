import { useContext } from "react";
import Popup from "../../ui/Popup";
import { PopupContext } from "@/contexts/popupContext";
import CreateDiagnosisForm from "./CreateDiagnosisForm";
export default function CreateDiagnosisButton() {
  const { isPopup, setIsPopup } = useContext(PopupContext);
  function handlePopup() {
    setIsPopup(true);
  }
  return (
    <>
      <button onClick={handlePopup} className="bg-custom-blue text-white">
        Create new diagnosis +
      </button>
      <Popup>
        <CreateDiagnosisForm />
      </Popup>
    </>
  );
}
