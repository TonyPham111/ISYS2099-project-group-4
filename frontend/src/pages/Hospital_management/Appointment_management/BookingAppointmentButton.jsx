import Popup from "@/component/ui/Popup/Popup";
import { PopupContext } from "@/contexts/popupContext";
import { useContext } from "react";
import BookingForm from "./BookingForm";
export default function BookingAppointmentButton() {
  const { setIsPopup } = useContext(PopupContext);
  function handlePopup() {
    setIsPopup(true);
  }
  return (
    <>
      <button
        onClick={handlePopup}
        className="bg-custom-blue px-[15px] text-white"
      >
        Booking +
      </button>
      <Popup>
        <BookingForm/>
      </Popup>
    </>
  );
}
