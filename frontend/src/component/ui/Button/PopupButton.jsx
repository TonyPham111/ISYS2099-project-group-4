import { useContext } from "react";
import Popup from "../Popup/Popup";
import { PopupContext } from "@/contexts/popupContext";
export default function PopupButton({text, PopupComponent, popupWidthSize, popupHeightSize}) {
  const {isPopup, setIsPopup} = useContext(PopupContext);
  function handlePopup(){
    setIsPopup(true);
  }
  return (
    <>
      <button onClick={handlePopup} className="bg-custom-blue text-white">
        {text}
      </button>
      <Popup widthSize={popupWidthSize} heightSize={popupHeightSize}>
        {PopupComponent}
      </Popup>
    </>
  );
}
