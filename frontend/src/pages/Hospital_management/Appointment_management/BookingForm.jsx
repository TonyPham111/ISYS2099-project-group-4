import CustomDatePicker from "@/component/ui/CustomDatePicker";
import CustomTimePicker from "@/component/ui/CustomTimePicker";
import * as patientService from "@/services/patientService";
import * as staffService from "@/services/staffService";
import { useContext, useEffect, useState } from "react";
import CustomAutoComplete from "@/component/ui/CustomAutoComplete";
import Editor from "@/component/ui/Editor";
import DataTable from "@/component/ui/DataTable";
import * as equal from "deep-equal";
import { PopupContext } from "@/contexts/popupContext";
export default function BookingForm() {
  const { setIsPopup } = useContext(PopupContext);

  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [departmentValue, setDepartmentValue] = useState(null);
  const [doctorValue, setDoctorValue] = useState("");

  const [beforeNoteValue, setBeforeNoteValue] = useState(null);

  const patientData = patientService.getPatients();
  const departmentData = staffService.getAllDepartments();
  const [doctorStatusData, setDoctorStatusData] = useState([]);

  const [patientValue, setPatientValue] = useState(null);

  const [loadingPatientData, setLoadingPatientData] = useState([]);
  const [loadingDepartmentData, setLoadingDepartmentData] = useState([]);

  useEffect(() => {
    setLoadingPatientData(patientData);
  }, [patientData]);
  useEffect(() => {
    setLoadingDepartmentData(departmentData);
  }, [departmentData]);

  function handleCheckAvailableDoctor() {
    if (date && startTime && endTime && patientValue && departmentValue) {
      setDoctorStatusData(
        staffService.getDoctorWorkingStatus(
          date,
          startTime,
          endTime,
          departmentValue
        )
      );
    } else {
      setDoctorStatusData([]);
    }
  }
  function handleOnClickOnDataTable(item, rowIndex) {
    setDoctorValue({
      id: item.id,
      name: item.last_name + " " + item.first_name,
    });
  }

  function handleOnBooking() {
    if (
      date &&
      startTime &&
      endTime &&
      patientValue &&
      departmentValue &&
      patientValue &&
      doctorValue
    ) {
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
              />
            </div>{" "}
            <div className="flex items-center justify-between w-[350px]">
              <p className="font-bold">End time:</p>
              <CustomTimePicker
                value={endTime}
                setValue={setEndTime}
                size={"sm"}
              />
            </div>
            <div className="flex items-center justify-between w-[350px] mt-[10px]">
              <p className="font-bold">patient:</p>
              <CustomAutoComplete
                options={loadingPatientData}
                value={patientValue}
                onChange={(event, value) => {
                  setPatientValue(value);
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
          <div className="flex items-end gap-[10px]">
            <button
              onClick={handleCheckAvailableDoctor}
              className="bg-custom-blue text-white py-2 w-[185px] text-sm"
            >
              check available doctor
            </button>
            <h3>:</h3>
            <div className="w-[150px] border-solid border-b-[1px] border-custom-dark-200">
              {doctorValue.name}
            </div>
            <CustomAutoComplete
              options={loadingDepartmentData}
              value={departmentValue}
              onChange={(event, value) => {
                setDepartmentValue(value);
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
          <DataTable
            handleOnClick={handleOnClickOnDataTable}
            hoverOnRow={doctorStatusData.length > 0}
            headerData={[
              "doctor_id",
              "first_name",
              "last_name",
              "gender",
              "available_status",
            ]}
            data={doctorStatusData}
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
