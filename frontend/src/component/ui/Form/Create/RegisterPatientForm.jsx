import { useContext, useRef, useState } from "react";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "../../DateTime/CustomAutoComplete";
import toast from "react-hot-toast";
import { duration } from "moment";
const RegisterPatientForm = () => {
  const { isPopup, setIsPopup } = useContext(PopupContext);
  const fullNameRef = useRef(null);
  const genderRef = useRef(null);
  const homeAddressRef = useRef(null);
  const contactPhoneNumberRef = useRef(null);
  const [birthDate, setBirthDate] = useState(null);
  const handleRegister = () => {
    const condition =
      fullNameRef.current &&
      genderRef.current &&
      homeAddressRef.current &&
      contactPhoneNumberRef.current &&
      birthDate;
    if (condition) {
      toast.success( 'create patient success !',{duration:5000}, )
      setIsPopup(false);
    }
  };
  return (
    /*---------form data-----------*/

    <div className="w-full h-full p-5 relative">
      <div className="w-full h-[90%] flex justify-center">
        <div className="w-2/3 flex flex-wrap justify-between">
          <div>
            <h4>Full name</h4>
            <input
              type="text"
              className="mt-[8px] border-[1px]"
              ref={fullNameRef}
            />
          </div>
          <div>
            <h4>gender</h4>
            <div className="mt-[8px] w-[350px]"> 
            <CustomAutoComplete
              options={[
                {
                  key: "M",
                  value: "Male",
                },
                {
                  key: "F",
                  value: "Female",
                },
              ]}
              onChange={(event, value)=>{
                console.log(`check value: ${JSON.stringify(value)}`);
                if(value){
                  genderRef.current = value.key;
                }
                else{
                  genderRef.current = null;
                }
              }}
              getOptionLabel={(option) => {
                return option.value;
              }}
              label="choose gender"
              size="full"
            />
            </div>
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
        <button
          onClick={handleRegister}
          className="h-12 w-[150px] bg-custom-blue text-white"
        >
          Register +
        </button>
      </div>
    </div>
  );
};

export default RegisterPatientForm;
