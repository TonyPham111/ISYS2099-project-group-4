import { useContext, useRef, useState } from "react";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import { PopupContext } from "@/contexts/popupContext";
import CustomAutoComplete from "../../DateTime/CustomAutoComplete";
import useSWR from "swr";
import UploadFileButton from "../../Button/UploadFileButton";
import fetcher from "@/utils/fetcher";
import ReviewPDF from "../../PDF/ReviewPDF";
import { IoEyeOff } from "react-icons/io5";

const AddStaffForm = () => {
  const { isPopup, setIsPopup } = useContext(PopupContext);
  const { data: jobData } = useSWR("http://localhost:8000/jobs", fetcher);
  /*-----personal information----*/
  const [fullName, setFullName] = useState(null);
  const [gender, setGender] = useState(null);
  const homeAddressRef = useRef(null);
  const contactPhoneNumberRef = useState(null);
  const emailRef = useRef(null);
  const wageRef = useRef(null);
  const [job, setJob] = useState(null);
  const [hireDate, setHireDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  /*----- staff password --------*/
  const [staffPassword, setStaffPassword] = useState("");
  /*----- staff education ------*/
  const [qualificationName, setQualificationName] = useState(null);
  const [institutionName, setInstitutionName] = useState(null);
  const [level, setLevel] = useState(null);
  const [qualificationGrade, setQualificationGrade] = useState(null);
  const [qualificationDate, setQualificationDate] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  /*----- staff experience ------*/
  const [jobTitle, setJobTitle] = useState(null);
  const [hospitalName, setHospitalName] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [letterOfReferenceFile, setLetterOfReferenceFile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  /*----- staff license ------*/
  const [licenseFile, setLicenseFile] = useState(null);
  const handleUploadCertificateFile = (files) => {
    setCertificateFile(files[0]);
  };
  const handleUploadLetterOfReferenceFile = (files) => {
    setLetterOfReferenceFile(files[0]);
  };
  const handleUploadLicenseFile = (files) => {
    setLicenseFile(files[0]);
  };
  const handleRegister = () => {
    const personalCondition =
      fullName &&
      gender &&
      homeAddressRef.current &&
      contactPhoneNumberRef.current &&
      birthDate &&
      wageRef.current > 0 &&
      emailRef.current;
    if (personalCondition) {
    }
    if (true) {
      setIsPopup(false);
    }
  };
  return (
    /*---------form data-----------*/
    <section className="h-full flex flex-col gap-[30px] overflow-scroll p-5">
      <h2>Staff personal information</h2>
      {/*-----staff personal information ---------*/}
      <div className="w-full h-[90%] flex justify-center">
        <div className="w-full flex flex-wrap justify-start gap-[100px]">
          <div>
            <h6>Full name</h6>
            <input className="mt-[8px] border-[1px]" ref={fullName} />
          </div>
          <div>
            <h6>gender</h6>
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
              />
            </div>
          </div>
          <div>
            <h6>Date of Birth</h6>
            <CustomDatePicker
              value={birthDate}
              setValue={setBirthDate}
              size={"lg"}
            />
          </div>
          <div>
            <h6>Home Address</h6>
            <input className="mt-[8px] border-[1px]" ref={homeAddressRef} />
          </div>
          <div>
            <h6>Contact phone number</h6>
            <input
              className="mt-[8px] border-[1px]"
              ref={contactPhoneNumberRef}
            />
          </div>
          <div>
            <h6>email</h6>
            <input className="mt-[8px] border-[1px]" ref={emailRef} />
          </div>
          <div>
            <h6>wage</h6>
            <input
              className="mt-[8px] border-[1px]"
              ref={wageRef}
              type="number"
              min={0}
              step={0.01}
            />
          </div>
          <div>
            <h6>hire date</h6>
            <CustomDatePicker
              value={hireDate}
              setValue={setHireDate}
              size={"lg"}
            />
          </div>
          <div>
            <h6>job position</h6>
            <div className="mt-[8px] w-[350px]">
              <CustomAutoComplete
                value={job?.job_name}
                options={jobData ? jobData : []}
                onChange={(event, value) => {
                  if (value) {
                    setJob(value);
                  } else {
                    setJob(null);
                  }
                }}
                getOptionLabel={(option) => {
                  return option.job_name;
                }}
                label="choose job"
                size="full"
              />
            </div>
          </div>
        </div>
      </div>
      {/*----- staff account password ------*/}
      <h2>Staff Account Password</h2>
      <div className="flex items-center">
        <input
          id="input-staff-password"
          type="password"
          autoComplete="new-password"
          onChange={(e) => {
            setStaffPassword(e.target.value);
          }}
        />
        <IoEyeOff
          onClick={() => {
            let inputPasswordType = document.getElementById(
              "input-staff-password"
            ).type;
            if (inputPasswordType == "password") {
              document.getElementById("input-staff-password").type = "text";
            } else {
              document.getElementById("input-staff-password").type = "password";
            }
          }}
          className="text-custom-dark-200 w-[25px] h-[25px] relative right-[35px] cursor-pointer"
        />
      </div>
      {/*---- staff education ---*/}
      <h2>Staff Education</h2>
      <div className="w-full flex flex-col gap-[15px] ">
        <div>
          <h6>Institution Name</h6>
          <input
            className="mt-[8px] border-[1px]"
            onChange={(event, value) => {
              setInstitutionName(value);
            }}
            value={institutionName}
          />
        </div>
        <div>
          <h6>Level</h6>
          <div className="mt-[8px] w-[350px]">
            <CustomAutoComplete
              options={[
                "HighSchool",
                "College",
                "Bachelor",
                "Master",
                "Doctorate",
              ]}
              onChange={(event, value) => {
                setLevel(value);
              }}
              getOptionLabel={(option) => {
                return option;
              }}
              label="choose level"
              size="full"
            />
          </div>
        </div>
        {/*----------- qualification ------------*/}
        <div className="w-full flex justify-start gap-[100px]">
          <div>
            <h6>Qualification name</h6>
            <input
              onChange={(e) => {
                setQualificationName(e.target.value);
              }}
              value={qualificationName}
              className="mt-[8px] border-[1px]"
            />
          </div>
          <div>
            <h6>Qualification grade</h6>
            <input
              className="mt-[8px] border-[1px]"
              onChange={(event, value) => {
                setQualificationGrade(value);
              }}
              value={qualificationGrade}
            />
          </div>
          <div>
            <h6>Qualification date</h6>
            <CustomDatePicker setValue={setQualificationDate} size={"lg"} />
          </div>
        </div>{" "}
        <div>
          <h6>Certificate</h6>
          {certificateFile && (
            <div className="w-full  bg-neutral-200 p-5">
              <ReviewPDF
                fileData={certificateFile}
                data={certificateFile}
                setData={setCertificateFile}
                allowDelete={true}
                pageHeight={400}
              />
            </div>
          )}
          {!certificateFile && (
            <UploadFileButton
              handleOnChange={handleUploadCertificateFile}
              textContent="upload pdf"
              acceptTypes=".pdf"
            />
          )}
        </div>
      </div>
      {/*------- staff experience -------*/}
      <h2>Staff Experience</h2>
      <div>
        <h6>Hospital name</h6>
        <input
          onChange={(e) => {
            setHospitalName(e.target.value);
          }}
          value={hospitalName}
          className="mt-[8px] border-[1px]"
        />
      </div>
      {/*---- row for job title and job description -----*/}
      <div className="w-full flex gap-[50px]">
        <div>
          <h6>job title</h6>
          <input
            onChange={(e) => {
              setJobTitle(e.target.value);
            }}
            value={jobTitle}
            className="mt-[8px] border-[1px]"
          />
        </div>
        <div>
          <h6>job description</h6>
          <textarea
            className="w-[350px] h-[100px] border-[1px] border-custom-dark-200 rounded-md"
            onChange={(e) => {
              setJobDescription(e.target.value);
            }}
            value={jobDescription}
          />
        </div>
      </div>{" "}
      {/*---- row for start time and end time -----*/}
      <div className="w-full flex gap-[50px]">
        <div>
          <h6>Start date</h6>
          <div className="mt-[8px] w-[350px]">
            <CustomDatePicker
              value={startDate}
              setValue={setStartDate}
              size={"full"}
              max={endDate}
            />
          </div>
        </div>
        <div>
          <h6>End date</h6>
          <div className="mt-[8px] w-[350px]">
            <CustomDatePicker
              value={endDate}
              setValue={setEndDate}
              size={"full"}
              min={startDate}
            />
          </div>
        </div>
      </div>
      <div>
        <h6>Letter Of Reference</h6>
        {letterOfReferenceFile && (
          <div className="w-full  bg-neutral-200 p-5">
            <ReviewPDF
              fileData={letterOfReferenceFile}
              data={letterOfReferenceFile}
              setData={setLetterOfReferenceFile}
              allowDelete={true}
              pageHeight={400}
            />
          </div>
        )}
        {!letterOfReferenceFile && (
          <UploadFileButton
            handleOnChange={handleUploadLetterOfReferenceFile}
            textContent="upload pdf"
            acceptTypes=".pdf"
          />
        )}
      </div>
      {job && (job.job_name == "Doctor" || job.job_name == "Nurse") && (
        <div>
          <h2>Staff license</h2>
          {licenseFile && (
            <div className="w-full  bg-neutral-200 p-5">
              <ReviewPDF
                fileData={licenseFile}
                data={licenseFile}
                setData={setLicenseFile}
                allowDelete={true}
                pageHeight={400}
              />
            </div>
          )}
          {!licenseFile && (
            <UploadFileButton
              handleOnChange={handleUploadLicenseFile}
              textContent="upload pdf"
              acceptTypes=".pdf"
            />
          )}
        </div>
      )}
      <div className="w-full mx-auto pt-5 border-t-2 border-custom-gray-200 flex justify-center">
        <button
          onClick={handleRegister}
          className="h-12 w-[150px] bg-custom-blue text-white"
        >
          Add +
        </button>
      </div>
    </section>
  );
};

export default AddStaffForm;
