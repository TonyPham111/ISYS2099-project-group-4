import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useContext, useState } from "react";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import detectEventOverlapping from "@/utils/eventOverlapping";
import Popup from "../Popup/Popup";
import { PopupContext } from "@/contexts/popupContext";
import AppointmentPopup from "../Popup/AppointmentPopup";
import { useLocation } from "react-router-dom";
import DataTable from "../Table/DataTable";
import dayjs from "dayjs";
import { indexOfEvent } from "@/utils/eventFunction";
import { ScheduleContext } from "@/contexts/scheduleContext";
// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

export default function Schedule({ auditable }) {
  const {
    events,
    setEvents,
    backgroundEvents,
    setBackgroundEvents,
    filterBackgroundEvents,
    setFilterBackgroundEvents,
  } = useContext(ScheduleContext);
  const { setIsPopup } = useContext(PopupContext);
  const [popupComponent, setPopupComponent] = useState(<></>);
  const [isSelectable, setIsSelectable] = useState(false);
  const location = useLocation();
  /*----------------------------main function use for react big calendar props-----------------------------------*/
  // function handleSelectSlot({ start, end }) {
  //   // allow to create new slot in schedule if it is not repeat with any backgroundEvent before it
  //   const selectedEvent = { end: end, start: start, title: "working time" };
  //   const isOverlapping = detectEventOverlapping(
  //     filterBackgroundEvents,
  //     selectedEvent
  //   );
  //   if (!isOverlapping) {
  //     setFilterBackgroundEvents((prev) => [...prev, selectedEvent]);
  //   }
  // }
  function handleOnSelectEvent(events) {
    //only allow to show detail of event which is appointment, not allow to show background event
    if (events.isBackgroundEvent) {
      //show background event information
      //allow to popup and delete background information
      if (isSelectable) {
        setPopupComponent(
          <WorkingTimeSchedulePopup
            startTime={events.start}
            endTime={events.end}
            title={events.title}
          />
        );
        setIsPopup(true);
      }
    } else {
      //only allow appointment router to able to cancel appointment [access control]
      if (location.pathname == "/appointment") {
        setPopupComponent(
          <AppointmentPopup appointmentData={events} ableToCancel={true} />
        );
        //else, cannot cancel appointment
      } else if (location.pathname == "/working-schedule") {
        setPopupComponent(
          <AppointmentPopup appointmentData={events} ableToUpdate={true} />
        );
      } else {
        setPopupComponent(<AppointmentPopup appointmentData={events} />);
      }
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
  /*
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
            doctor_id: item.doctor_id,
            before_note: item.before_note,
            during_note: item.during_note,
            after_note: item.after_note,
            title: item.purpose_of_appointment,
            start: convertStringFormatToDate(item.date, item.start_time),
            end: convertStringFormatToDate(item.date, item.end_time),
          };
        })}
        backgroundEvents={filterBackgroundEvents}
        onSelectEvent={handleOnSelectEvent}
        onView={auditable && handleViewChange}
        startAccessor="start"
        endAccessor="end"
      />
      <Popup>{popupComponent}</Popup>
    </>
  );
}

function WorkingTimeSchedulePopup({ startTime, endTime, title, readOnly }) {
  const {
    events,
    setEvents,
    filterBackgroundEvents,
    setFilterBackgroundEvents,
  } = useContext(ScheduleContext);
  const { setIsPopup } = useContext(PopupContext);

  function handleDeleteEvent() {
    const indexOfDeleteBackgroundEvent = indexOfEvent(
      { start: startTime, end: endTime },
      filterBackgroundEvents
    );

    //if appear in add new event --> remove only add new event
    if (indexOfDeleteBackgroundEvent >= 0) {
      filterBackgroundEvents.splice(indexOfDeleteBackgroundEvent, 1);

      setFilterBackgroundEvents([...filterBackgroundEvents]);
      setIsPopup(false);
    } else {
      //react hot toast there is an error occur
    }
  }
  return (
    <section className="w-full h-full p-[40px] flex flex-col items-start gap-[20px]">
      <h1>Working Time</h1>
      <div className="w-1/2">
        <DataTable
          headerData={["start", "end"]}
          data={[
            {
              start: dayjs(startTime).format("DD/MM/YYYY"),
              end: dayjs(endTime).format("DD/MM/YYYY"),
            },
          ]}
        />
      </div>
      {/*------- delete current working time -------*/}
      <div className="w-1/2 mt-[30px] border-t-[2px] border-solid border-custom-dark-100 pt-[30px]">
        <button
          onClick={handleDeleteEvent}
          className="bg-red-600 text-white p-3"
        >
          Delete current working time
        </button>
      </div>
    </section>
  );
}
