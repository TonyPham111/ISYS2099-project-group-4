import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import CustomTimePicker from "@/component/ui/DateTime/CustomTimePicker";
import { useContext, useRef, useState } from "react";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import Editor from "@/component/ui/Editor/Editor";
import { PopupContext } from "@/contexts/popupContext";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import dayjs from "dayjs";
import { json } from "react-router-dom";
import toast from "react-hot-toast";
export default function BookingForm() {
  const { setIsPopup } = useContext(PopupContext);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [doctorValue, setDoctorValue] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [beforeNoteValue, setBeforeNoteValue] = useState(null);

  const { data: patientData } = useSWR(
    "http://localhost:8000/patients",
    fetcher
  );
  const { data: departmentData } = useSWR(
    "http://localhost:8000/departments",
    fetcher
  );
  const [doctorStatusUrl, setDoctorStatusUrl] = useState("");
  const { data: doctorStatusData } = useSWR(doctorStatusUrl, fetcher);
  const isAvailableToCheckDoctorStatus = useRef(false);

  function handleCheckAvailableDoctor() {
    if (date && startTime && endTime && patientId && departmentId) {
      setDoctorStatusUrl(
        `http://localhost:8000/available_doctors?date=${date}&start=${startTime}&end=${endTime}&departmentId=${departmentId}`
      );
      isAvailableToCheckDoctorStatus.current = true;
    } else {
      // setDoctorStatusData([]);
      isAvailableToCheckDoctorStatus.current = false;
    }
  }
  function handleOnClickOnDataTable(item, rowIndex) {
    if (item.doctor_available_status == "available") {
      setDoctorValue({
        id: item.doctor_id,
        name: item.doctor_full_name,
      });
    }
  }

  function handleOnBooking() {
    if (
      date &&
      startTime &&
      endTime &&
      patientId &&
      departmentId &&
      doctorValue &&
      beforeNoteValue
    ) {
      const sendData = {
        doctor_id: doctorValue.doctor_id,
        patientId: patientId,
        date: dayjs(date).format('YYYY-MM-DD'),
        start: dayjs(startTime).format('HH:mm:ss'),
        end: dayjs(endTime).format('HH:mm:ss'),
        before_note: JSON.stringify(beforeNoteValue),
      }
      console.log(`check sendDATA: ${JSON.stringify(sendData)}`);
      toast.success('booking new appointment success!');
      setIsPopup(false);
    }
  }
  return (
    <section className="flex flex-col gap-[20px]">
      <section className="w-full h-full p-3 flex justify-between h-[90%]">
        {/*-----------------------          left side part         --------------------------*/}
        <div className="w-1/2 flex flex-col gap-[10px]">
          <h3>Appointment</h3>
          {/*-------------------- choosing day, start time, end time, patient ---------------------*/}
          <div className="flex flex-col items-start gap-[5px]">
            <div className="flex items-center justify-between w-[350px]">
              <p className="font-bold">Date:</p>
              <CustomDatePicker value={date} setValue={setDate} size={"sm"} />
            </div>
            <div className="flex items-center justify-between w-[350px]">
              <p className="font-bold">Start time:</p>
              <CustomTimePicker
                value={startTime}
                setValue={setStartTime}
                size={"sm"}
                readOnly={!date}
              />
            </div>{" "}
            <div className="flex items-center justify-between w-[350px]">
              <p className="font-bold">End time:</p>
              <CustomTimePicker
                value={endTime}
                setValue={setEndTime}
                size={"sm"}
                minTime={startTime}
                readOnly={!startTime}
              />
            </div>
            <div className="flex items-center justify-between w-[350px] mt-[10px]">
              <p className="font-bold">patient:</p>
              <CustomAutoComplete
                options={patientData}
                onChange={(event, value) => {
                  setPatientId(value?.id);
                }}
                getOptionLabel={(option) => {
                  return (
                    "#" +
                    option.id +
                    " : " +
                    option.last_name +
                    " " +
                    option.first_name
                  );
                }}
                label={"Patient ... "}
                size={"lg"}
              />
            </div>
          </div>
          {/*------------------------------------------------------------------------------------*/}
          <div className="flex items-end gap-[15px]">
            <button
              onClick={handleCheckAvailableDoctor}
              className="bg-custom-blue text-white py-2 w-[185px] text-sm"
            >
              check available doctor
            </button>
            <h3>:</h3>
            <div className="group w-[150px] h-[35px] flex justify-center border-solid hover:border-[1px] border-b-[1px] border-custom-dark-200 hover:rounded-md relative">
              {doctorValue?.name}
              <button
                onClick={() => {
                  setDoctorValue(null);
                }}
                className="group-hover:block hidden absolute -right-[10px] -top-[20px] flex justify-center items-center bg-custom-dark-100 rounded-full w-[30px] h-[30px] text-black-200"
              >
                -
              </button>
            </div>
            <CustomAutoComplete
              options={departmentData}
              onChange={(event, value) => {
                setDepartmentId(value?.id);
              }}
              getOptionLabel={(option) => {
                return option.name;
              }}
              label={"department"}
              size={"md"}
            />
          </div>

          <div>
            <h5>Purpose of Appointment:</h5>
            <textarea className="w-full h-[50px] border-solid border-[1px] border-custom-dark-200" />
            <h5>Before note:</h5>
            <Editor
              value={beforeNoteValue}
              setValue={setBeforeNoteValue}
              className=""
            />
          </div>
        </div>
        {/*-----------------------------------------------------------------------------*/}
        {/*-----------------------          right side part         --------------------------*/}
        <div className="w-[40%] border-solid border-[1px] border-custom-dark-200 rounded-2xl p-5">
          <BookingDataTable
            handleOnClick={handleOnClickOnDataTable}
            hoverOnRow={isAvailableToCheckDoctorStatus}
            headerData={[
              "doctor_id",
              "doctor_full_name",
              "doctor_gender",
              "doctor_available_status",
            ]}
            data={
              isAvailableToCheckDoctorStatus.current && doctorStatusData
                ? doctorStatusData
                : []
            }
          />
        </div>
        {/*-----------------------------------------------------------------------------*/}
      </section>
      <section className="pt-5 border-t-[1px] border-solid border-custom-dark h-[8%] flex justify-center">
        <button
          onClick={handleOnBooking}
          className="py-2 bg-custom-blue text-white px-4"
        >
          Booking +{" "}
        </button>
      </section>
    </section>
  );
}
function BookingDataTable({ headerData, data, handleOnClick, hoverOnRow }) {
  return (
    <section className="w-full overflow-scroll rounded-xl">
      <table className=" w-full">
        <thead className="h-[50px] bg-custom-dark-100 p-3">
          <tr>
            {headerData.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              className={
                item["doctor_available_status"] == "available"
                  ? "tr--hover"
                  : "bg-[#BABABA] opacity-[50%]"
              }
              onClick={() => {
                handleOnClick(item, rowIndex);
              }}
              key={item.id}
            >
              {headerData.map((keyItem) => {
                if (keyItem == "doctor_available_status") {
                  return (
                    <td
                      key={keyItem + item.id}
                      className={
                        item[keyItem] == "available"
                          ? "bg-custom-blue text-white"
                          : "bg-red-900 text-white"
                      }
                    >
                      {item[keyItem]}
                    </td>
                  );
                } else {
                  return <td key={keyItem + item.id}>{item[keyItem]}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
