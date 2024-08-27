import { useEffect, useContext, useRef } from "react";
import { PopupContextProvider } from "@/contexts/popupContext";
import BookingAppointmentButton from "./BookingAppointmentButton";
import Schedule from "@/component/ui/schedule/Schedule";
import { ScheduleContext } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const Appointment = () => {
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/appointments`,
    fetcher
  );
  const { events, setEvents } = useContext(ScheduleContext);
  const isFetchedEventData = useRef(false);
  useEffect(() => {
    if (data && !isFetchedEventData.current) {
      setEvents(data);
      isFetchedEventData.current = true;
    }
  }, [data]);
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  } else if (data) {
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
  }
};

export default Appointment;
