import { useEffect, useContext, useRef } from "react";
import * as staffService from "@/services/staffService";
import { ScheduleContext } from "@/contexts/scheduleContext";
import { PopupContextProvider } from "@/contexts/popupContext";
import Schedule from "@/component/ui/schedule/Schedule";

export default function WorkingSchedule() {
  const appointmentsData = staffService.getAllAppointments();
  const { events, setEvents, backgroundEvents, setBackgroundEvents} = useContext(ScheduleContext);
  const isFetchedEventData = useRef(false);
  useEffect(() => {
    if (appointmentsData && !isFetchedEventData.current) {
      setEvents(appointmentsData);
      isFetchedEventData.current = true;
    }
  }, [appointmentsData]);
  useEffect(() => {}, [events]);
  if (!isFetchedEventData) {
    return <></>;
  }
  return (
    <section className="w-11/12 h-[90%] flex flex-col justify-between">
      {/*--------------------popup appointment detail when click on appointment-------------------------*/}
      <PopupContextProvider>
        <Schedule auditable={false}/>
      </PopupContextProvider>
    </section>
  );
}
