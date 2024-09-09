import CustomAutoComplete from "@/component/ui/DateTime/CustomAutoComplete";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import UploadFileButton from "@/component/ui/Button/UploadFileButton";
import ReviewPDF from "@/component/ui/PDF/ReviewPDF";
import DiscardAndSaveButton from "@/component/ui/Button/DiscardAndSaveButton";
import toast from "react-hot-toast";
import { UserContext } from "@/contexts/userContext";
export default function StaffTrainingMaterial() {
  const { userData } = useContext(UserContext);
  const { data: jobData } = useSWR("http://localhost:8000/jobs", fetcher);
  const { data: departmentData } = useSWR(
    "http://localhost:8000/departments",
    fetcher
  );
  const [job, setJob] = useState(null);
  const [department, setDepartment] = useState(null);
  const [url, setUrl] = useState(null);
  const { data: trainingMaterialData } = useSWR(url ? url : null, fetcher);
  const [trainingMaterial, setTrainingMaterial] = useState([]);
  function handleUploadMaterial(files) {
    setTrainingMaterial([files[0], ...trainingMaterial]);
  }
  function handleDiscardChange() {
    setTrainingMaterial([]);
  }
  function handleSaveInformation() {
    if (trainingMaterial.length > 0) {
      toast.success("save successfully");
    }
  }
  //   useEffect(() => {
  //     console.log(
  //       `check training material data: ${JSON.stringify(
  //         trainingMaterialData.training_materials
  //       )}`
  //     );
  //   }, [trainingMaterialData]);
  useEffect(() => {
    console.log(`check job data: ${JSON.stringify(job)}`);
    console.log(`check department data: ${JSON.stringify(department)}`);
    if (userData.job_role != "HR" && (!job || !department)) {
      console.log(`check user data: ${JSON.stringify(userData)}`);
      setJob({
        job_id: userData.job_id,
        job_name: userData.job_name,
      });
      setDepartment({
        department_id: userData.department_id,
        name: userData.department_name,
      });
      setUrl(
        `http://localhost:8000/training_material?department_id=${userData.department_id}&job_id=${userData.job_id}`
      );
    }
  }, [userData, job, department]);
  return (
    <section className="h-full flex flex-col justify-between">
      <div className="h-[85%]">
        {/*----------   search training material --------*/}
        {userData.job_role == "HR" && (
          <div className="flex gap-[50px] items-center">
            <div className="w-[250px]">
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
            <div className="w-[250px]">
              <CustomAutoComplete
                value={department?.name}
                options={departmentData}
                onChange={(event, value) => {
                  setDepartment(value);
                }}
                getOptionLabel={(option) => {
                  return option.name;
                }}
                label={"choose department"}
                size={"full"}
              />
            </div>
            <button
              onClick={() => {}}
              className="bg-custom-blue text-white py-2 "
            >
              Search Material
            </button>
          </div>
        )}
        {job && department && (
          <>
            <h4>Staff Training Material</h4>
            {/*---------- training material --------*/}
            <div className="flex gap-[20px]">
              {userData.job_role == "HR" && (
                <>
                  <h6>Upload Material</h6>
                  <UploadFileButton
                    handleOnChange={handleUploadMaterial}
                    textContent="upload pdf"
                    acceptTypes=".pdf"
                  />
                </>
              )}
            </div>
            {trainingMaterialData && (
              <div className="w-full flex gap-[30px] h-[470px] overflow-w-scroll p-5 bg-custom-dark-100">
                {[
                  ...trainingMaterialData?.training_materials,
                  ...trainingMaterial,
                ].map((item) => {
                  return (
                    <ReviewPDF
                      key={item}
                      fileData={item}
                      data={trainingMaterial}
                      StaffTrainingMaterial={setTrainingMaterial}
                      allowDelete={userData.job_role == "HR"}
                      pageHeight={380}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      {userData.job_role == "HR" && (
        <DiscardAndSaveButton
          handleDiscardChange={handleDiscardChange}
          handleSaveInformation={handleSaveInformation}
        />
      )}
    </section>
  );
}
