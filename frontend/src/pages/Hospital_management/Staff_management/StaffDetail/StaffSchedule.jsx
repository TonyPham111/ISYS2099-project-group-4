import Schedule from "@/component/ui/schedule/Schedule";
import { useContext, useEffect, useRef, useState } from "react";
import * as staffService from "@/services/staffService";
import { useParams } from "react-router-dom";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { PopupContextProvider } from "@/contexts/popupContext";
export default function StaffSchedule() {
  const { id } = useParams();
  const staffAppointmentsData = staffService.getStaffAppointments(id);
  const staffScheduleData = staffService.getStaffSchedule(id);
  const [events, setEvents] = useState([]);
  const isSettingEvent = useRef(false);
  const isSettingBackgroundEvent = useRef(false);
  const [backgroundEvents, setBackgroundEvents] = useState([]);

  useEffect(() => {
    if (staffAppointmentsData && isSettingEvent.current == false) {
      setEvents(staffAppointmentsData);
      isSettingEvent.current = true;
    }
    if (staffScheduleData && isSettingBackgroundEvent.current == false) {
      const data = staffScheduleData.map((item) => {
        return {
          title: "working time",
          start: convertStringFormatToDate(item.date, item.start_time),
          end: convertStringFormatToDate(item.date, item.end_time),
        };
      });
      setBackgroundEvents(data);
      isSettingBackgroundEvent.current = true;
    }
  }, [staffAppointmentsData]);
  return (
    <div className="w-full h-[80%]">
      {/*----when click appointment, it need to popup to show detail, show we need this context provider----*/}
      <PopupContextProvider>
        <Schedule
          events={events}
          backgroundEvents={backgroundEvents}
          setBackgroundEvents={setBackgroundEvents}
        />
      </PopupContextProvider>
    </div>
  );
}
