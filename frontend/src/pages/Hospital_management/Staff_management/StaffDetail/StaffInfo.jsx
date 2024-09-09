import dayjs from "dayjs";
import CustomDatePicker from "@/component/ui/DateTime/CustomDatePicker";
import * as staffService from "@/services/staffService";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { UserContext } from "@/contexts/userContext";
import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import UploadFileButton from "@/component/ui/Button/UploadFileButton";
import ReviewPDF from "@/component/ui/PDF/ReviewPDF";
import { IoEyeOff } from "react-icons/io5";

export default function StaffInfo() {
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const { data: jobData } = useSWR("http://localhost:8000/jobs", fetcher);
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/staffs/${id}`,
    fetcher
  );
  /*-----personal information----*/
  const [fullName, setFullName] = useState(null);
  const [gender, setGender] = useState(null);
  const [homeAddress, setHomeAddress] = useState(null);
  const [contactPhoneNumber, setContactPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [wage, setWage] = useState(null);
  const [job, setJob] = useState(null);
  const [hireDate, setHireDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  /*----- staff password --------*/
  const [staffPassword, setStaffPassword] = useState(null);
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
  useEffect(() => {
    if (data) {
      setFullName(data.full_name);
      setGender(data.gender);
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(data.hire_date, "DD/MM/YYYY"));
      setJob({ job_name: data.job_name });
      setWage(data.wage);
      setEmail(data.email);
      setQualificationName(data.qualification_name);
      setInstitutionName(data.institution_name);
      setLevel(data.level);
      setQualificationGrade(data.qualification_grade);
      setQualificationDate(dayjs(data.qualification_date, "DD/MM/YYYY"));
      setCertificateFile(data.certificate_file);

      setJobTitle(data.job_title);
      setHospitalName(data.hospital_name);
      setJobDescription(data.job_description);
      setStartDate(dayjs(data.start_date, "DD/MM/YYYY"));
      setEndDate(dayjs(data.end_date, "DD/MM/YYYY"));

      setLetterOfReferenceFile(data.letter_of_reference_file);
      setLicenseFile(data.license_file);
    }
  }, [data]);
  function handleSaveInformation() {}
  function handleDiscardChange() {
    if (data) {
      setFullName(data.full_name);
      setGender(data.gender);
      setHomeAddress(data.home_address);
      setContactPhoneNumber(data.contact_phone_number);
      setBirthDate(dayjs(data.birth_date, "DD/MM/YYYY"));
      setHireDate(dayjs(data.hire_date, "DD/MM/YYYY"));
      setJob({ job_name: data.job_name });
      setWage(data.wage);
      setEmail(data.email);
    }
  }
  const handleUploadCertificateFile = (files) => {
    setCertificateFile(files[0]);
  };
  const handleUploadLetterOfReferenceFile = (files) => {
    setLetterOfReferenceFile(files[0]);
  };
  const handleUploadLicenseFile = (files) => {
    setLicenseFile(files[0]);
  };
  if (error) {
    return <div>error when loading data</div>;
  } else if (isLoading) {
    return <div>isLoading</div>;
  } else if (data) {
    /*---------form data-----------*/
    return (
      <section className="w-full h-full flex flex-col justify-center">
        <div className="h-full flex flex-col gap-[30px] overflow-scroll p-5">
          <h2>Staff personal information</h2>
          {/*-----staff personal information ---------*/}
          <div className="w-full h-[90%] flex justify-center">
            <div className="w-full flex flex-wrap justify-start gap-[100px]">
              <div>
                <h6>Full name</h6>
                <input
                  className="mt-[8px] border-[1px]"
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                  value={fullName}
                />
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
                <input
                  className="mt-[8px] border-[1px]"
                  onChange={(e) => {
                    setHomeAddress(e.target.value);
                  }}
                  value={homeAddress}
                />
              </div>
              <div>
                <h6>Contact phone number</h6>
                <input
                  className="mt-[8px] border-[1px]"
                  onChange={(e) => {
                    setContactPhoneNumber(e.target.value);
                  }}
                  value={contactPhoneNumber}
                />
              </div>
              <div>
                <h6>email</h6>
                <input
                  className="mt-[8px] border-[1px]"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
              <div>
                <h6>wage</h6>
                <input
                  className="mt-[8px] border-[1px]"
                  onChange={(e) => {
                    setWage(e.target.value);
                  }}
                  value={wage}
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
                    value={job}
                    options={jobData ? jobData : []}
                    onChange={(event, value) => {
                      if (value) {
                        setJob(value.job_id);
                      } else {
                        setGender(null);
                      }
                    }}
                    getOptionLabel={(option) => {
                      return option?.job_name;
                    }}
                    label="choose job"
                    size="full"
                  />
                </div>
              </div>
            </div>
          </div>
          {userData.job_role == "HR" && (
            <>
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
                      value={level}
                      label="choose level"
                      size="full"
                    />
                  </div>
                </div>
                {job?.job_name == "HR" && <></>}
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
                    <CustomDatePicker
                      value={qualificationDate}
                      setValue={setQualificationDate}
                      size={"lg"}
                    />
                  </div>
                </div>
                <div>
                  <h6>Certificate</h6>
                  {certificateFile && (
                    <div className="w-full  bg-neutral-200 p-5">
                      <ReviewPDF
                        fileData={certificateFile}
                        data={certificateFile}
                        setData={setCertificateFile}
                        allowDelete={true}
                        pageWidth={800}
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
              <div className="w-full flex gap-[100px]">
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
              </div>
              {/*---- row for start time and end time -----*/}
              <div className="w-full flex gap-[100px]">
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
                      pageHeight={800}
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
              {(job?.job_name == "Doctor" || job?.job_name == "Nurse") && (
                <>
                  <h2>Staff license</h2>
                  {licenseFile && (
                    <div className="w-full  bg-neutral-200 p-5">
                      <ReviewPDF
                        fileData={licenseFile}
                        data={licenseFile}
                        setData={setLicenseFile}
                        allowDelete={true}
                        pageHeight={800}
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
                </>
              )}
            </>
          )}
        </div>
        {/*-------------------------------------- lower part --------------------------------*/}
        {userData.job_role == "HR" && (
          <DiscardAndSaveButton
            handleDiscardChange={handleDiscardChange}
            handleSaveInformation={handleSaveInformation}
          />
        )}
      </section>
    );
  }
}
