import { useContext, useState } from "react";
import CustomDatePicker from "../../DateTime/CustomDatePicker";
import CustomTimePicker from "../../DateTime/CustomTimePicker";
import { ScheduleContext } from "@/contexts/scheduleContext";
import convertStringFormatToDate from "@/utils/convertStringFormatToDate";
import dayjs from "dayjs";
import isTheSameDate from "@/utils/isTheSameDate";
import toast from "react-hot-toast";
import { useLocalizationContext } from "@mui/x-date-pickers/internals";
import { PopupContext } from "@/contexts/popupContext";

export default function UpdateScheduleForm() {
  const {setIsPopup} = useContext(PopupContext);
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const { filterBackgroundEvents, setFilterBackgroundEvents } =
    useContext(ScheduleContext);

  function handleAddNewSchedule() {
    let condition = true;
    const dateWithFormat = dayjs(date).format("DD/MM/YYYY");
    const startTimeWithFormat = dayjs(startTime).format("HH:mm:ss");
    const endTimeWithFormat = dayjs(endTime).format("HH:mm:ss");
    const newWorkingScheduleObject = {
      title: "working time",
      start: convertStringFormatToDate(dateWithFormat, startTimeWithFormat),
      end: convertStringFormatToDate(dateWithFormat, endTimeWithFormat),
    };
    if (date && startTime && endTime) {
      for (let i = 0; i < filterBackgroundEvents.length; ++i) {
        if (
          isTheSameDate(
            filterBackgroundEvents[i].start,
            newWorkingScheduleObject.start
          )
        ) {
          condition = false;
        }
      }
      if (condition) {
        setFilterBackgroundEvents([
          ...filterBackgroundEvents,
          newWorkingScheduleObject,
        ]);
        setIsPopup(false);
        toast.success('new schedule have been added, please save information to finalize it!');
      }else{
        toast.error('cannot add new schedule, only allow on schedule only in 1 date!');
      }
    }
  }
  return (
    <section className="w-full h-full flex flex-col items-center p-2">
      <h3 className="text-custom-blue">Add new Schedule + </h3>
      <div className="flex flex-col gap-[10px] h-[80%]">
        <h5 className="text-custom-blue">Step 1:</h5>
        <div className="w-full flex items-center justify-between">
          <h5>DATE:</h5>
          <CustomDatePicker value={date} setValue={setDate} size={"lg"} />
        </div>
        <h5 className="text-custom-blue">Step 2:</h5>
        <div className="w-full flex items-center justify-between">
          <h5>Start Time:</h5>
          <CustomTimePicker
            value={startTime}
            setValue={setStartTime}
            size={"lg"}
            readOnly={!date}
          />
        </div>{" "}
        <h5 className="text-custom-blue">Step 3:</h5>
        <div className="w-full flex items-center justify-between">
          <h5>End Time:</h5>
          <CustomTimePicker
            value={endTime}
            setValue={setEndTime}
            size={"lg"}
            readOnly={!date || !startTime}
            minTime={startTime}
          />
        </div>
      </div>
      <div className="w-full py-3 my-5 border-t-[1px] border-solid border-custom-dark-300 flex justify-center">
        <button
          onClick={handleAddNewSchedule}
          className="bg-custom-blue text-white "
        >
          Add +
        </button>
      </div>
    </section>
  );
}
