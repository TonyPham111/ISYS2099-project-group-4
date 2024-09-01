import Schedule from "@/component/ui/schedule/Schedule";
import { useContext, useEffect, useRef, useState, createContext } from "react";
import * as staffService from "@/services/staffService";
import { useParams } from "react-router-dom";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import { PopupContextProvider } from "@/contexts/popupContext";
import DiscardAndSaveButton from "@/component/ui/DiscardAndSaveButton";
import filterEventArray, {
  detectAppointmentNotCover,
} from "@/utils/eventFunction";
import { ScheduleContext } from "@/contexts/scheduleContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
export default function StaffSchedule() {
  const { id } = useParams();
  const { error, isLoading, data } = useSWR(
    `http://localhost:8000/staffs/${id}/schedule`,
    fetcher
  );
  const {
    events,
    setEvents,
    backgroundEvents,
    setBackgroundEvents,
    filterBackgroundEvents,
    setFilterBackgroundEvents,
  } = useContext(ScheduleContext);

  const isSettingData = useRef(false);

  //load data when it already get data from api
  useEffect(() => {
    if (data && isSettingData.current == false) {
      setEvents(data.staff_appointment);
      const staffScheduleData = data.staff_schedule.map((item) => {
        return {
          title: "working time",
          start: convertStringFormatToDate(item.date, item.start_time),
          end: convertStringFormatToDate(item.date, item.end_time),
        };
      });
      setBackgroundEvents(staffScheduleData);
      setFilterBackgroundEvents(staffScheduleData);
      isSettingData.current = true;
    }
  }, [data]);

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
    if (data) {
      setEvents(data.staff_appointment);
    }
    const staffScheduleData= data.staff_schedule.map((item) => {
      return {
        title: "working time",
        start: convertStringFormatToDate(item.date, item.start_time),
        end: convertStringFormatToDate(item.date, item.end_time),
      };
    });
    setBackgroundEvents(staffScheduleData);
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  } else if (data) {
    return (
      <div className="w-full h-full flex flex-col gap-[10px]">
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
}
