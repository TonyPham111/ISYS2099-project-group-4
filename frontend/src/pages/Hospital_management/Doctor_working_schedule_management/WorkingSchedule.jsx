import { useEffect, useContext, useRef } from "react";
import * as staffService from "@/services/staffService";
import { ScheduleContext } from "@/contexts/scheduleContext";
import { PopupContextProvider } from "@/contexts/popupContext";
import Schedule from "@/component/ui/schedule/Schedule";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
export default function WorkingSchedule() {
  const { userData } = useContext(UserContext);
  const { setEvents, setBackgroundEvents, setFilterBackgroundEvents } =
    useContext(ScheduleContext);
  const { data: workingScheduleData } = useSWR(
    userData ? `http://localhost:8000/staffs/${userData.id}/schedule` : null,
    fetcher
  );
  const settingScheduleData = useRef(false);
  useEffect(() => {
    if (workingScheduleData && !settingScheduleData.current) {
      setEvents(workingScheduleData.staff_appointment);
      const staffScheduleData = workingScheduleData.staff_schedule.map(
        (item) => {
          return {
            title: "working time",
            start: convertStringFormatToDate(item.date, item.start_time),
            end: convertStringFormatToDate(item.date, item.end_time),
          };
        }
      );
      setBackgroundEvents(staffScheduleData);
      setFilterBackgroundEvents(staffScheduleData);
      settingScheduleData.current = true;
    }
  }, [workingScheduleData]);
  if (!workingScheduleData) {
    return <></>;
  }
  return (
    <section className="w-11/12 h-[90%] flex flex-col justify-between">
      {/*--------------------popup appointment detail when click on appointment-------------------------*/}
      <PopupContextProvider>
        <Schedule auditable={true} />
      </PopupContextProvider>
    </section>
  );
}
