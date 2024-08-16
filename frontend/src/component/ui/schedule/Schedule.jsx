import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useContext, useState } from "react";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import detectEventOverlapping from "@/utils/eventOverlapping";
import Popup from "../Popup";
import { PopupContext } from "@/contexts/popupContext";
import AppointmentPopup from "../AppointmentPopup";
import { patient } from "@/services/sampleData";
// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer
export default function Schedule({
  events,
  backgroundEvents,
  setBackgroundEvents,
}) {
  const [isSelectable, setIsSelectable] = useState(false);
  const { setIsPopup } = useContext(PopupContext);
  const [popupComponent, setPopupComponent] = useState(<div>hello</div>);
  /*----------------------------main function use for react big calendar props-----------------------------------*/
  function handleSelectSlot({ start, end }) {
    // allow to create new slot in schedule if it is not repeat with any backgroundEvent before it
    const selectedEvent = { end: end, start: start, title: "working time" };
    const isOverlapping = detectEventOverlapping(
      backgroundEvents,
      selectedEvent
    );
    if (!isOverlapping) {
      setBackgroundEvents((prev) => [...prev, selectedEvent]);
    }
  }
  function handleOnSelectEvent(events) {
    //only allow to show detail of event which is appointment, not allow to show background event
    console.log(JSON.stringify(events.patient_id));
    console.log(JSON.stringify(events.id));
    if (!events.isBackgroundEvent) {
      setPopupComponent(
        <AppointmentPopup patient_id={events.patient_id} appointment_id={events.id}/>
      )
      setIsPopup(true);
    }
  }
  function handleViewChange(view) {
    if (view == "month") {
      setIsSelectable(false);
    } else {
      setIsSelectable(true);
    }
  }
  /*-------------------------------------------------------------------------------------------------------------*/
  return (
    <>
      <Calendar
        localizer={localizer}
        events={events.map((item) => {
          return {
            id: item.id,
            patient_id: item.patient_id,
            title: item.purpose_of_appointment,
            start: convertStringFormatToDate(item.date, item.start_time),
            end: convertStringFormatToDate(item.date, item.end_time),
          };
        })}
        backgroundEvents={backgroundEvents}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleOnSelectEvent}
        onView={handleViewChange}
        selectable={isSelectable}
        startAccessor="start"
        endAccessor="end"
      />
      <Popup>
        {popupComponent}
      </Popup>
    </>
  );
}
