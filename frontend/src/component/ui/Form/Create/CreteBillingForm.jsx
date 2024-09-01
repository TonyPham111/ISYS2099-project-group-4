import { useContext, useEffect, useState } from "react";
import CustomAutoComplete from "../../DateTime/CustomAutoComplete";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { PopupContext } from "@/contexts/popupContext";
export default function CreateBillingForm() {
  const { data: patientData } = useSWR(
    "http://localhost:8000/patients",
    fetcher
  );
  const { setIsPopup } = useContext(PopupContext);
  const [appointmentUrl, setAppointmentUrl] = useState(null);
  const [treatmentUrl, setTreatmentUrl] = useState(null);
  const [testingUrl, setTestingUrl] = useState(null);
  const [chargeData, setChargeData] = useState({
    patientId: null,
    appointmentId: null,
    treatmentId: null,
    testingId: null,
  });
  const { data: appointmentData } = useSWR(
    appointmentUrl ? appointmentUrl : null,
    fetcher
  );
  const { data: treatmentData } = useSWR(
    treatmentUrl ? treatmentUrl : null,
    fetcher
  );
  const { data: testingData } = useSWR(testingUrl ? testingUrl : null, fetcher);
  function handlePreloadingData(event, value) {
    setChargeData({
      ...chargeData,
      patientId: value.id,
    });
    console.log(
      `check event: ${event}\n check value: ${JSON.stringify(value)}`
    );
    setAppointmentUrl(
      `http://localhost:8000/appointments?patientId=${value.id}&status=done`
    );
    setTreatmentUrl(
      `http://localhost:8000/treatment-histories?patientId=${value.id}`
    );
    setTestingUrl(`http://localhost:8000/patients/${value.id}/testings`);
  }
  function handleCreateBilling() {
    console.log(`check cahrgetDATA: ${JSON.stringify(chargeData)}`);
    if (
      chargeData.patientId &&
      (chargeData.appointmentId ||
        chargeData.testingId ||
        chargeData.treatmentId)
    ) {
      //send request to backend
      setIsPopup(false);
    }
  }
  if (!patientData) {
    return <></>;
  }
  return (
    <section className="w-full h-full p-2 px-8 flex flex-col items-center">
      <h3 className="text-custom-blue">Create Billing</h3>
      {/*-------------------- choose patient -----------------*/}
      <div className="w-full border-b-[0.5px] py-3 border-solid border-custom-dark-200">
        <h4>Step 1:</h4>
        <div className=" flex gap-[20px] mt-[10px]">
          <div className="w-[200px] ">
            <CustomAutoComplete
              options={patientData}
              getOptionLabel={(option) => {
                return `#${option.id}: ${option.first_name} ${option.last_name} `;
              }}
              onChange={(event, value) => {
                handlePreloadingData(event, value);
              }}
              label={"choose patient"}
              size={"sm"}
            />
          </div>
          <p className="text-custom-dark-300 self-center">
            Please choose patient first
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[20px] mt-[20px]">
        <h4>Step 2:</h4>

        {/*---------- appointment charge ---------*/}
        <h5>2.1: Appointment Charge</h5>
        <div className="w-[800px] ">
          <CustomAutoComplete
            options={appointmentData}
            getOptionLabel={(option) => {
              return `#${option.id}:Doctor id: ${option.doctor_id} Date:${option.date}, Start: ${option.start_time}, End: ${option.end_time}  `;
            }}
            onChange={(event, value) => {
              setChargeData({
                ...chargeData,
                appointmentId: value.id,
              });
            }}
            label={"choose patient's appointment"}
            size={"sm"}
            readOnly={!appointmentData}
          />
        </div>
        {/*---------- treatment charge ---------*/}
        <h5>2.2: Treatment Charge</h5>
        <div className="w-[800px] ">
          <CustomAutoComplete
            options={treatmentData}
            getOptionLabel={(option) => {
              return `#${option.treatment_id}: Date: ${option.date}, Doctor id: ${option.doctor_id} `;
            }}
            onChange={(event, value) => {
              setChargeData({
                ...chargeData,
                treatmentId: value.treatment_id,
              });
            }}
            label={"choose patient's treatment"}
            size={"sm"}
            readOnly={!treatmentData}
          />
        </div>
        {/*---------- testing charge ---------*/}
        <h5>2.3: Testing Charge</h5>
        <div className="w-[800px] ">
          <CustomAutoComplete
            options={testingData}
            getOptionLabel={(option) => {
              return `Ordering Date: ${option.ordering_date}, Ordering Doctor: ${option.ordering_doctor} `;
            }}
            onChange={(event, value) => {
              setChargeData({
                ...chargeData,
                testingId: value.id,
              });
            }}
            label={"choose patient's treatment"}
            size={"sm"}
            readOnly={!treatmentData}
          />
        </div>
      </div>
      {/*-------- create button --------*/}
      <div className="w-full flex items-center justify-center p-3 mt-4 border-solid border-t-[0.5px] border-custom-dark-200">
        <button
          onClick={handleCreateBilling}
          className="bg-custom-blue text-white p-3"
        >
          {" "}
          create billing +{" "}
        </button>
      </div>
    </section>
  );
}
