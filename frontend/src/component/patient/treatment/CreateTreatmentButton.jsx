import { useContext } from "react";
import Popup from "../../ui/Popup";
import CreateTreatmentForm from "./CreateTreatmentForm";
import { PopupContext } from "@/contexts/popupContext";
export default function CreateTreatmentButton() {
  const {isPopup, setIsPopup} = useContext(PopupContext);
  function handlePopup(){
    setIsPopup(true);
  }
  return (
    <>
      <button onClick={handlePopup} className="bg-custom-blue text-white">
        Create new treatment +{" "}
      </button>
      <Popup>
        <CreateTreatmentForm/>
      </Popup>
    </>
  );
}
