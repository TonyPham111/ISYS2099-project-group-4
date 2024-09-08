import Schedule from "@/component/ui/schedule/Schedule";
import { useContext, useEffect, useRef, useState, createContext } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { PopupContextProvider } from "@/contexts/popupContext";
import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import filterEventArray, {
  detectAppointmentNotCover,
  filterEventArrayByDate,
} from "@/utils/eventFunction";
import { ScheduleContext } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
import PopupButton from "@/component/ui/Button/PopupButton";
import UpdateScheduleForm from "@/component/ui/Form/Create/UpdateScheduleForm";
import toast from "react-hot-toast";
import dayjs from "dayjs";
export default function StaffSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const isSettingData = useRef(false);
  // const [originBackgroundEvent, setOriginBackgroundEvent] = useState([]);
  const {
    data: staffData,
    isLoading,
    error,
  } = useSWR(`http://localhost:8000/staffs/${id}`, fetcher);
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
  useEffect(() => {
    if (scheduleData && !isSettingData.current) {
      setEvents(scheduleData.staff_appointment);
      const staffScheduleData = scheduleData.staff_schedule.map((item) => {
        return {
          title: "working time",
          start: convertStringFormatToDate(item.date, item.start_time),
          end: convertStringFormatToDate(item.date, item.end_time),
        };
      });
      setFilterBackgroundEvents(staffScheduleData);
      setBackgroundEvents(staffScheduleData);
      // setOriginBackgroundEvent(staffScheduleData);
      isSettingData.current = true;
    }
  }, [scheduleData]);

  //set filter background event when add background events array change or delete background events array change

  function handleSaveInformation() {
    if (scheduleData) {
      const originBackgroundEvent = scheduleData.staff_schedule.map((item) => {
        return {
          start: convertStringFormatToDate(item.date, item.start_time),
          end: convertStringFormatToDate(item.date, item.end_time),
        };
      });
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
        let updateEventList, deletedEventList;
        //added event list is create from new updated schedule --> appear on updated schedule but not appear in before update schedule/
        updateEventList = filterEventArray(
          filterBackgroundEvents,
          originBackgroundEvent
        );
        //delete event list is create from old schedule --> if old schedule have that working time but updated schedule add to deleted event lsit
        deletedEventList = filterEventArray(
          originBackgroundEvent,
          filterBackgroundEvents
        );
        //ensure that delete  event list is only add if it not occur in update schedule and old schedule
        deletedEventList = filterEventArrayByDate(
          deletedEventList,
          updateEventList
        );
        //reformat data before send
        if (updateEventList.length > 0) {
          updateEventList = updateEventList.map((item) => {
            return {
              date: dayjs(item.start).format("YYYY-MM-DD"),
              start_time: dayjs(item.start).format("HH:mm:ss"),
              end_time: dayjs(item.end).format("HH:mm:ss"),
            };
          });
        }
        if (deletedEventList.length > 0) {
          deletedEventList = deletedEventList.map((item) => {
            return {
              date: dayjs(item.start).format("YYYY-MM-DD"),
              start_time: dayjs(item.start).format("HH:mm:ss"),
              end_time: dayjs(item.end).format("HH:mm:ss"),
            };
          });
        }
        const sendData = {
          staff_id: id,
          updateSchedules: updateEventList,
          deleteSchedules: deletedEventList,
        };
        console.log(`check sendData: ${JSON.stringify(sendData)}`);
      } else {
        // console.log(
        //   `check not cover Array: ${JSON.stringify(notFullyCoverEventArray)}`
        // );
        toast.error(
          `cannot save information, there ${
            notFullyCoverEventArray.length === 1
              ? `is 1 appointment`
              : `are ${notFullyCoverEventArray.length} appointments`
          } that not cover!`
        );
      }
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
    setFilterBackgroundEvents(staffScheduleData);
  }
  if (isLoading || !isSettingData) {
    return <></>;
  }
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full flex justify-end">
        <PopupContextProvider>
          <PopupButton
            popupWidthSize={"w-[600px]"}
            popupHeightSize={"h-[45vw]"}
            PopupComponent={<UpdateScheduleForm />}
            text={"update schedule +"}
          />
        </PopupContextProvider>
      </div>
      {/*----when click appointment, it need to popup to show detail, so we need this context provider----*/}
      <div className="h-[80%]">
        <PopupContextProvider>
          <Schedule auditable={true} />
        </PopupContextProvider>
      </div>
      <DiscardAndSaveButton
        handleDiscardChange={handleDiscardChange}
        handleSaveInformation={handleSaveInformation}
      />
    </div>
  );
}
