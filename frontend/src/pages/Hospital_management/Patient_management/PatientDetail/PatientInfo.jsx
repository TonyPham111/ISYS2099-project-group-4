import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import dayjs from "dayjs";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import { constructNow } from "date-fns";
import toast from "react-hot-toast";
export default function PatientInfo() {
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/patients/${id}`,
    fetcher
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
      if (data.gender == "Male") {
        setGender({
          key: "M",
          value: "Male",
        });
      }
      if (data.gender == "Female") {
        setGender({
          key: "F",
          value: "Female",
        });
      }
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD-MM-YYYY"));
    }
  }, [data]);
  function handleSaveInformation() {
    if (!gender) {
      toast.error("cannot leave gender input blank!");
    }
    if (homeAddress == "") {
      toast.error("cannot leave home address input blank!");
    }
    if (!birthDate) {
      toast.error("cannot leave home address input blank!");
    }
    if (contactPhoneNumber == "") {
      toast.error("cannot leave phone number address input blank!");
    }
    //still not consider gender and full name
    if (
      homeAddress == data.home_address &&
      new Date(birthDate).toDateString() ==
        new Date(dayjs(data.birth_date, "DD-MM-YYYY")).toDateString() &&
      contactPhoneNumber == data.contact_phone_number
    ) {
      toast.error("cannot save new data without changing it!");
    } else {
      toast.success("save patient information success!");
    }
  }
  function handleDiscardChange() {
    if (data) {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      if (data.gender == "Male") {
        setGender({
          key: "M",
          value: "Male",
        });
      }
      if (data.gender == "Female") {
        setGender({
          key: "F",
          value: "Female",
        });
      }
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
              readOnly={userData.job_role !== "FrontDesk"}
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
              readOnly={userData.job_role !== "FrontDesk"}
            />
          </div>
          <div>
            <h4>gender</h4>
            <div className="mt-[8px] w-[350px]">
              <CustomAutoComplete
                value={gender}
                options={["M", "F"]}
                onChange={(event, value) => {
                  if (value) {
                    setGender(value);
                  } else {
                    setGender(null);
                  }
                }}
                getOptionLabel={(option) => {
                  if (option == "M") {
                    return "Male";
                  } else if (option == "F") {
                    return "Female";
                  }
                }}
                label="choose gender"
                size="full"
                readOnly={userData.job_role !== "FrontDesk"}
              />
            </div>
          </div>
          <div>
            <h4>Date of Birth</h4>
            <CustomDatePicker
              value={birthDate}
              setValue={setBirthDate}
              size={"lg"}
              readOnly={userData.job_role !== "FrontDesk"}
            />
          </div>
          {userData.job_role == "FrontDesk" && (
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
        </div>
        {/*-------------------------------------- lower part --------------------------------*/}
        {userData.job_role == "FrontDesk" && (
          <DiscardAndSaveButton
            handleDiscardChange={handleDiscardChange}
            handleSaveInformation={handleSaveInformation}
          />
        )}
      </div>
    </>
  );
}
