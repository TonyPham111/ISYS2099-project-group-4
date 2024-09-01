import Schedule from "@/component/ui/schedule/Schedule";
import { useContext, useEffect, useRef, useState, createContext } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { PopupContextProvider } from "@/contexts/popupContext";
import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import filterEventArray, {
  detectAppointmentNotCover,
} from "@/utils/eventFunction";
import { ScheduleContext } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
import PopupButton from "@/component/ui/Button/PopupButton";
import UpdateScheduleForm from "@/component/ui/Form/Create/UpdateScheduleForm";
export default function StaffSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const [isSettingData, setIsSettingData] = useState(false);
  const { data: staffData, isLoading, error } = useSWR(
    `http://localhost:8000/staffs/${id}`,
    fetcher
  );
  const { data: scheduleData } = useSWR(
    `http://localhost:8000/staffs/${id}/schedule`,
    fetcher
  );
  useEffect(() => {
    if (
      staffData &&
      (userData.id !== staffData.manager_id || userData.job_role == "HR")
    ) {
      navigate("/dashboard");
    }
  }, [userData, staffData]);
  const {
    events,
    setEvents,
    backgroundEvents,
    setBackgroundEvents,
    filterBackgroundEvents,
    setFilterBackgroundEvents,
  } = useContext(ScheduleContext);

  //load data when it already get data from api
  // useEffect(() => {
    if (scheduleData && isSettingData == false) {
      setEvents(scheduleData.staff_appointment);
      const staffScheduleData = scheduleData.staff_schedule.map((item) => {
        return {
          title: "working time",
          start: convertStringFormatToDate(item.date, item.start_time),
          end: convertStringFormatToDate(item.date, item.end_time),
        };
      });
      setBackgroundEvents(staffScheduleData);
      setFilterBackgroundEvents(staffScheduleData);
      setIsSettingData(true);
    }
  // }, [staffData]);

  //set filter background event when add background events array change or delete background events array change

  function handleSaveInformation() {
    const formattedEventArray = events.map((item) => {
      return {
        title: item.purpose_of_appointment,
        start: convertStringFormatToDate(item.date, item.start_time),
        end: convertStringFormatToDate(item.date, item.end_time),
      };
    });
    //check if is there any appointment that is not cover
    const notFullyCoverEventArray = detectAppointmentNotCover(
      formattedEventArray,
      filterBackgroundEvents
    );
    if (notFullyCoverEventArray.length === 0) {
      //if all appointment is fully cover, please create add event array and delete event array list to send to api
      let addedEventList, deletedEventList;
      //added event list is create from new updated schedule --> appear on updated schedule but not appear in before update schedule/
      addedEventList = filterEventArray(
        filterBackgroundEvents,
        backgroundEvents
      );
      //delete event list is create from old schedule --> if old schedule have that working time but updated schedule add to deleted event lsit
      deletedEventList = filterEventArray(
        backgroundEvents,
        filterBackgroundEvents
      );
      // console.log(`added list: ${JSON.stringify(addedEventList)}`);
      // console.log(`deleted list: ${JSON.stringify(deletedEventList)}`);
    }
  }
  function handleDiscardChange() {
    if (scheduleData) {
      setEvents(scheduleData.staff_appointment);
    }
    const staffScheduleData = scheduleData.staff_schedule.map((item) => {
      return {
        title: "working time",
        start: convertStringFormatToDate(item.date, item.start_time),
        end: convertStringFormatToDate(item.date, item.end_time),
      };
    });
    setBackgroundEvents(staffScheduleData);
  }
  if (isLoading || !isSettingData) {
    return <></>;
  } 
    return (
      <div className="w-full h-full flex flex-col gap-[10px]">
        <div className="w-full flex justify-end">
          <PopupContextProvider>
            <PopupButton
            popupWidthSize={'w-[600px]'}
           popupHeightSize={'h-[45vw]'} 
              PopupComponent={<UpdateScheduleForm/>}
              text={"update schedule +"}
            />
          </PopupContextProvider>
        </div>
        {/*----when click appointment, it need to popup to show detail, show we need this context provider----*/}
        <PopupContextProvider>
          <Schedule auditable={true} />
        </PopupContextProvider>
        <DiscardAndSaveButton
          handleDiscardChange={handleDiscardChange}
          handleSaveInformation={handleSaveInformation}
        />
      </div>
    );
}
