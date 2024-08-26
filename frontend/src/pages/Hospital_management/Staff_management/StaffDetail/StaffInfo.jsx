import dayjs from "dayjs";
import CustomDatePicker from "@/component/ui/CustomDatePicker";
import * as staffService from "@/services/staffService";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DiscardAndSaveButton from "@/component/ui/DiscardAndSaveButton";

export default function StaffInfo() {
  const { id } = useParams();
  const staffData = staffService.getStaff(id);
  const jobs = staffService.getJob();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [gender, setGender] = useState(null);
  const [homeAddress, setHomeAddress] = useState(null);
  const [contactPhoneNumber, setContactPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [employmentType, setEmploymentType] = useState(null);
  const [wage, setWage] = useState(null);
  const [job, setJob] = useState(null);
  const [hireDate, setHireDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  useEffect(() => {
    if (staffData) {
      setFirstName(staffData.first_name);
      setLastName(staffData.last_name);
      setGender(staffData.gender);
      setHomeAddress(staffData.home_address);
      setContactPhoneNumber(staffData.contact_phone_number);
      setBirthDate(dayjs(staffData.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(staffData.hire_date, "DD/MM/YYYY"));
      setJob(staffData.job);
      setWage(staffData.wage);
      setEmail(staffData.email);
      setEmploymentType(staffData.employment_type);
    }
  }, [staffData]);
  function handleSaveInformation() {}
  function handleDiscardChange() {
    if (staffData) {
      setFirstName(staffData.first_name);
      setLastName(staffData.last_name);
      setGender(staffData.gender);
      setHomeAddress(staffData.home_address);
      setContactPhoneNumber(staffData.contact_phone_number);
      setBirthDate(dayjs(staffData.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(staffData.hire_date, "DD/MM/YYYY"));
      setJob(staffData.job);
      setWage(staffData.wage);
      setEmail(staffData.email);
      setEmploymentType(staffData.employment_type);
    }
  }
  if (!staffData) {
    return <></>;
  }
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center">
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
          <div>
            <h4>wage</h4>
            <input
              onChange={(e) => {
                setWage(e.target.value);
              }}
              value={wage}
              className="mt-[8px] border-[1px]"
            />
          </div>
          <div>
            <h4>employment type</h4>
            <select
              onChange={(e) => {
                setEmploymentType(e.target.value);
              }}
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              <option value="Fulltime">fulltime</option>
              <option value="shiftBased">shift based</option>
            </select>
          </div>
          <div>
            <h4>hire date</h4>
            <CustomDatePicker
              value={hireDate}
              setValue={setHireDate}
              size={"lg"}
            />
          </div>
          <div>
            <h4>job position</h4>
            <select
              onChange={(e) => {
                setJob(e.target.value);
              }}
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              {jobs.map((item) => (
                <option value={item.id}>{item.job_name}</option>
              ))}
            </select>
          </div>
        </div>
        {/*-------------------------------------- lower part --------------------------------*/}
      <DiscardAndSaveButton handleDiscardChange={handleDiscardChange} handleSaveInformation={handleSaveInformation}/> 
      </div>
    </>
  );
}
