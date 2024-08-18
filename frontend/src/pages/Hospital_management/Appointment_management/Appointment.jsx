import { PopupContextProvider } from "@/contexts/popupContext";
import BookingAppointmentButton from "./BookingAppointmentButton";
import * as staffService from "@/services/staffService";
import { useEffect, useState } from "react";
import Schedule from "@/component/ui/schedule/Schedule";
const Appointment = () => {
  const appointmentsData = staffService.getAllAppointments();
  const [data, setData] = useState(null);
  const [popupComponent, setPopupComponent] = useState(null);
  useEffect(() => {
    if (appointmentsData && !data) {
      setData(appointmentsData);
    }
  }, [appointmentsData]);
  if (!data) {
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
          <Schedule
            events={data}
            backgroundEvents={[]}
            setBackgroundEvents={() => {}}
          />
        </PopupContextProvider>
      </div>
    </section>
  );
};

export default Appointment;
