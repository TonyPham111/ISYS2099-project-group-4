import { useContext, useRef, useState } from "react";
import CustomDatePicker from "@/component/ui/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
const RegisterPatientForm = () => {
  const {isPopup, setIsPopup} = useContext(PopupContext);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const genderRef = useRef(null);
  const homeAddressRef = useRef(null);
  const contactPhoneNumberRef = useRef(null);
  const [birthDate, setBirthDate] = useState(null);
  const handleRegister = () => {
    console.log(isPopup);
    const condition = firstNameRef && lastNameRef && genderRef && homeAddressRef && contactPhoneNumberRef && birthDate;
    console.log(`condition: ${condition}`);
    if(condition){
        console.log("hello");
       setIsPopup(false);
    }
  };
  return (
    /*---------form data-----------*/

    <div className="w-full h-full p-5 relative">
      <div className="w-full h-[90%] flex justify-center">
        <div className="w-2/3 flex flex-wrap justify-between">
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
            <CustomDatePicker value={birthDate} setValue={setBirthDate} />
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
        </div>
      </div>

      <div className="w-full mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center">
        <button onClick={handleRegister} className= "h-12 w-[150px] bg-custom-blue text-white">
          Register +
        </button>
      </div>
    </div>
  );
};

export default RegisterPatientForm;
