import DiscardAndSaveButton from "@/component/ui/DiscardAndSaveButton";
import dayjs from "dayjs";
import CustomDatePicker from "@/component/ui/CustomDatePicker";
import * as patientService from "@/services/patientService";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export default function PatientInfo() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/patients/${id}`,fetcher
  );
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState(null);
  const [homeAddress, setHomeAddress] = useState(null);
  const [contactPhoneNumber, setContactPhoneNumber] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  useEffect(() => {
    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setGender(data.gender);
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD-MM-YYYY"));
    }
  }, [data]);
  function handleSaveInformation() {}
  function handleDiscardChange() {
    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setGender(data.gender);
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD-MM-YYYY"));
    }
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  }
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center">
        {/*-------------------------------------- upper part --------------------------------*/}
        <div className="h-5/6 w-full flex flex-wrap justify-between">
          <div>
            <h4>First name</h4>
            <input
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              className="mt-[8px] border-[1px]"
            />
          </div>
          <div>
            <h4>Last name</h4>
            <input
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              className="mt-[8px] border-[1px]"
            />
          </div>
          <div>
            <h4>gender</h4>
            <select
              onChange={(e) => {
                setGender(e.target.value);
              }}
              value={gender}
              name="Male"
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <h4>Date of Birth</h4>
            <CustomDatePicker
              value={birthDate}
              setValue={setBirthDate}
              size={"lg"}
            />
          </div>
          <div>
            <h4>Home Address</h4>
            <input
              onChange={(e) => {
                setHomeAddress(e.target.value);
              }}
              value={homeAddress}
              className="mt-[8px] border-[1px]"
            />
          </div>
          <div>
            <h4>Contact phone number</h4>
            <input
              onChange={(e) => {
                setContactPhoneNumber(e.target.value);
              }}
              value={contactPhoneNumber}
              className="mt-[8px] border-[1px]"
            />
          </div>
        </div>
        {/*-------------------------------------- lower part --------------------------------*/}
        <DiscardAndSaveButton
          handleDiscardChange={handleDiscardChange}
          handleSaveInformation={handleSaveInformation}
        />
      </div>
    </>
  );
}
