import { useEffect, useContext, useRef } from "react";
import { PopupContextProvider } from "@/contexts/popupContext";
import BookingAppointmentButton from "./BookingAppointmentButton";
import * as staffService from "@/services/staffService";
import Schedule from "@/component/ui/schedule/Schedule";
import { ScheduleContext } from "@/contexts/scheduleContext";
const Appointment = () => {
  const appointmentsData = staffService.getAllAppointments();
  const { events, setEvents } = useContext(ScheduleContext);
  const isFetchedEventData = useRef(false);
  useEffect(() => {
    if (appointmentsData && !isFetchedEventData.current) {
      setEvents(appointmentsData);
      isFetchedEventData.current = true;
    }
  }, [appointmentsData]);
  useEffect(()=>{
  },[events]);
  if (!isFetchedEventData) {
    return <></>;
  }
  return (
    <section className="w-11/12 h-[90%] flex flex-col justify-between">
      <div className="w-full h-[15%] bg-white rounded-2xl p-5  flex justify-between items-center">
        <h1>Booking appointment</h1>
        {/*----when click in booking button, there is popup so we need popup context provider in here-----*/}
        <PopupContextProvider>
          <BookingAppointmentButton />
        </PopupContextProvider>
      </div>
      <div className="w-full h-[80%] bg-white rounded-2xl p-5 ">
        {/*--------------------popup appointment detail when click on appointment-------------------------*/}
        <PopupContextProvider>
          <Schedule auditable={false} />
        </PopupContextProvider>
      </div>
    </section>
  );
};

export default Appointment;
