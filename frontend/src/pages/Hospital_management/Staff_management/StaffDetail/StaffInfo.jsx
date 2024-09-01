import dayjs from "dayjs";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import * as staffService from "@/services/staffService";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
export default function StaffInfo() {
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/staffs/${id}`,
    fetcher
  );
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
    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setGender(data.gender);
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(data.hire_date, "DD/MM/YYYY"));
      setJob(data.job);
      setWage(data.wage);
      setEmail(data.email);
      setEmploymentType(data.employment_type);
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
      setBirthDate(dayjs(data.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(data.hire_date, "DD/MM/YYYY"));
      setJob(data.job);
      setWage(data.wage);
      setEmail(data.email);
      setEmploymentType(data.employment_type);
    }
  }
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  } else if (data) {
    return (
      <>
        <div className="w-full h-full flex flex-col justify-center">
          <div className="h-5/6 w-full flex flex-wrap justify-between">
            <div>
              <h4>First name</h4>
              <input
                readOnly={userData.job_role !== "HR"}
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
                readOnly={userData.job_role !== "HR"}
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
                disabled={userData.job_role !== "HR"}
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
                readOnly={userData.job_role !== "HR"}
                value={birthDate}
                setValue={setBirthDate}
                size={"lg"}
              />
            </div>
            {userData.job_role == "HR" && (
              <>
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
              </>
            )}
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
              <h4>hire date</h4>
              <CustomDatePicker
                readOnly={userData.job_role !== "HR"}
                value={hireDate}
                setValue={setHireDate}
                size={"lg"}
              />
            </div>
            <div>
              <h4>job position</h4>
              <select
                readOnly={userData.job_role !== "HR"}
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
          {userData.job_role == "HR" && (
            <DiscardAndSaveButton
              handleDiscardChange={handleDiscardChange}
              handleSaveInformation={handleSaveInformation}
            />
          )}
        </div>
      </>
    );
  }
}
