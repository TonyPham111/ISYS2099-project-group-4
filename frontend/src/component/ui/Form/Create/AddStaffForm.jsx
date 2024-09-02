import { useContext, useRef, useState } from "react";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
import * as staffService from "@/services/staffService.js";
const AddStaffForm = () => {
  const job = staffService.getJob();
  const { isPopup, setIsPopup } = useContext(PopupContext);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const genderRef = useRef(null);
  const homeAddressRef = useRef(null);
  const contactPhoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const wageRef = useRef(null);
  const employmentTypeRef = useRef(null);
  const jobRef = useRef(null);
  const [hireDate, setHireDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const handleRegister = () => {
    const condition =
      firstNameRef &&
      lastNameRef &&
      genderRef &&
      homeAddressRef &&
      contactPhoneNumberRef &&
      birthDate;
    if (condition) {
      setIsPopup(false);
    }
  };
  return (
    /*---------form data-----------*/

    <div className="w-full h-full p-5 relative">
      <div className="w-full h-[90%] flex justify-center">
        <div className="w-full flex flex-wrap justify-between">
          <div>
            <h4>First name</h4>
            <input className="mt-[8px] border-[1px]" ref={firstNameRef} />
          </div>
          <div>
            <h4>Last name</h4>
            <input className="mt-[8px] border-[1px]" ref={lastNameRef} />
          </div>
          <div>
            <h4>gender</h4>
            <select
              onChange={(e) => {
                genderRef.current = e.target.value;
              }}
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              <option selected value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <h4>Date of Birth</h4>
            <CustomDatePicker value={birthDate} setValue={setBirthDate} size={"lg"} />
          </div>
          <div>
            <h4>Home Address</h4>
            <input className="mt-[8px] border-[1px]" ref={homeAddressRef} />
          </div>
          <div>
            <h4>Contact phone number</h4>
            <input
              className="mt-[8px] border-[1px]"
              ref={contactPhoneNumberRef}
            />
          </div>
          <div>
            <h4>email</h4>
            <input className="mt-[8px] border-[1px]" ref={emailRef} />
          </div>
          <div>
            <h4>wage</h4>
            <input className="mt-[8px] border-[1px]" ref={wageRef} />
          </div>
          <div>
            <h4>employment type</h4>
            <select
              onChange={(e) => {
                employmentTypeRef.current = e.target.value;
              }}
              name="Male"
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              <option value="Fulltime">fulltime</option>
              <option value="shiftBased">shift based</option>
            </select>
          </div>
          <div>
            <h4>hire date</h4>
            <CustomDatePicker value={hireDate} setValue={setHireDate} size={"lg"}/>
          </div>
          <div>
            <h4>job position</h4>
            <select
              onChange={(e) => {
                jobRef.current = e.target.value;
              }}
              className="mt-[8px] p-[3px] border-[1.1px]"
            >
              {job.map((item) => (
                <option value={item.id}>{item.job_name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center">
        <button
          onClick={handleRegister}
          className="h-12 w-[150px] bg-custom-blue text-white"
        >
          Add +
        </button>
      </div>
    </div>
  );
};

export default AddStaffForm;
